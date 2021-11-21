const parsers = require("./parsers");
const AWS = require("aws-sdk");
const {promisify} = require("util");

const codeBuildAsyncs = ["startBuild", "stopBuild", "batchGetBuilds", "listBuildsForProject", "listBuilds", "listProjects"];

module.exports = class CodeBuildService{
    constructor(creds = {accessKeyId, secretAccessKey, region}){
        this.cb = new AWS.CodeBuild(creds);
        this.ec2 = new AWS.EC2(creds);
        this.aws = {};
        this.aws.describeRegions = promisify(this.ec2.describeRegions).bind(this.ec2);
        for (const func of codeBuildAsyncs){
            this.aws[func] = promisify(this.cb[func]).bind(this.cb);
        }
    }

    static from(params, settings){
        return new CodeBuildService({
            accessKeyId: parsers.string(params.accessKeyId || settings.accessKeyId),
            secretAccessKey: params.secretAccessKey || settings.secretAccessKey,
            region: parsers.autocomplete(params.region || settings.region)
        });
    }
    
    async startBuild({project, sourceVersion, debugSessionEnabled}){
        if (!project) throw "Must provide a project to create the build of."
        try {
            const { build: result } = await this.aws.startBuild({
                projectName: project,
                sourceVersion, debugSessionEnabled
            });
            return result;
        }
        catch (error){
            throw `Error with starting a new build for project '${project}': 
${error.message || JSON.stringify(error)}'`
        }
    }
    
    async stopBuild({build}){
        if (!build) throw "Must provide a build to stop."
        try {
            const { build: result } = await this.aws.stopBuild({id: build});
            return result;
        }
        catch (error){
            throw `Error with stoping the build '${build}': 
${error.message || JSON.stringify(error)}'`
        }
    }
    
    async getBuilds({builds}){
        if (!builds) throw "Must provide a build to return information about."
        if (!Array.isArray(builds)) builds = [builds];
        try {
            const { builds: result } = await this.aws.batchGetBuilds({ids: builds});
            return result;
        }
        catch (error){
            throw `Error with getting the builds ${builds.map(b => `'${b}'`).join(", ")}: 
${error.message || JSON.stringify(error)}'`
        }
    }
    
    async createProjectFromJson({project}){
        if (!project || !Object.keys(project).length){ 
            throw "Didn't provide an object or provided object was empty.";
        }
        return this.cb.createProject(project).promise();
    }
    
    async updateProjectFromJson({project}){
        if (!project || !Object.keys(project).length){ 
            throw "Didn't provide an object or provided object was empty.";
        }
        return this.cb.updateProject(project).promise();
    }

    async getProject({project}){
        if (!project){
            throw "Didn't provide a project to return information about.";
        }
        const result = await this.cb.batchGetProjects({names: [project]}).promise();
        if (result.projectsNotFound && result.projectsNotFound.length) {
            throw `Couldn't find project '${project}'`;
        }
        return result.projects[0];
    }

    async deleteProject({project}){
        if (!project){
            throw "Didn't provide a project to delete.";
        }
        return this.cb.deleteProject({name: project}).promise();
    }
    
    async listRegions(){
        const {Regions: result} = await this.aws.describeRegions({});
        return result;
    }
    
    async listProjects({nextToken, getAll}){
        var result = await this.aws.listProjects({
            sortBy: "LAST_MODIFIED_TIME",
            sortOrder: "DESCENDING",
            nextToken
        });
        if (!getAll || !result.nextToken) return result;        
        const projects = result.projects;
        while (result.nextToken){
            result = await this.listProjects({nextToken: result.nextToken});
            projects.push(...result.projects);
        }
        return projects;
    }
    
    async listBuilds({project, nextToken, getAll}){
        var result;
        if (project){
            result = await this.aws.listBuildsForProject({
                projectName: project,
                sortOrder: "DESCENDING",
                nextToken
            });
        }
        else {
            result = await this.aws.listBuilds({
                sortOrder: "DESCENDING",
                nextToken
            });
        }
        if (!getAll || !result.nextToken) return result;      
        const builds = result.builds;
        while (result.nextToken){
            result = await this.listBuilds({project, nextToken: result.nextToken});
            builds.push(...result.builds);
        }
        return builds;
    }
}