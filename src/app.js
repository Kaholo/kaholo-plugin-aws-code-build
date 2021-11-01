const parsers = require("./parsers");
const CodeBuildService = require('./aws.codebuild.service');

async function startBuild(action, settings){
    const { project, sourceVersion, debugSessionEnabled } = action.params;
    const client = CodeBuildService.from(action.params, settings);
    return client.startBuild({
        project: parsers.autocomplete(project),
        sourceVersion: parsers.string(sourceVersion),
        debugSessionEnabled: parsers.boolean(debugSessionEnabled)
    });
}

async function stopBuild(action, settings){
	const build = parsers.autocomplete(action.params.build);
    const client = CodeBuildService.from(action.params, settings);
    return client.stopBuild({build});
}

async function getBuilds(action, settings){
	const builds = parsers.autocomplete(action.params.builds);
    const client = CodeBuildService.from(action.params, settings);
    return client.getBuilds({builds});
} 

async function listProjects(action, settings){
    const client = CodeBuildService.from(action.params, settings);
    return client.listProjects({getAll: true});
}

async function listBuilds(action, settings){
	const project = parsers.autocomplete(action.params.project);
    const client = CodeBuildService.from(action.params, settings);
    return client.listBuilds({project, getAll: true});
} 

module.exports = {
    startBuild,
	stopBuild,
	getBuilds,
    listProjects,
    listBuilds,
// Autocomplete Functions
    ...require("./autocomplete")
}