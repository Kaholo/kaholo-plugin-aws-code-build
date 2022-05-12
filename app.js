const awsPluginLibrary = require("kaholo-aws-plugin-library");
const _ = require("lodash");
const AWS = require("aws-sdk");
const { fetchRecursively } = require("./helpers");
const autocomplete = require("./autocomplete");
const payloadFunctions = require("./payload-functions");

const simpleAwsMethods = {
  startBuild: awsPluginLibrary.generateAwsMethod("startBuild", payloadFunctions.prepareStartBuildPayload),
  stopBuild: awsPluginLibrary.generateAwsMethod("stopBuild", payloadFunctions.prepareStopBuildPayload),
  getBuilds: awsPluginLibrary.generateAwsMethod("batchGetBuilds", payloadFunctions.prepareGetBuildsPayload),
  createProjectFromJson: awsPluginLibrary.generateAwsMethod("createProject", payloadFunctions.prepareJsonProjectRelatedPayload),
  updateProjectFromJson: awsPluginLibrary.generateAwsMethod("updateProject", payloadFunctions.prepareJsonProjectRelatedPayload),
  getProject: awsPluginLibrary.generateAwsMethod("batchGetProjects", payloadFunctions.prepareGetProjectPayload),
  deleteProject: awsPluginLibrary.generateAwsMethod("deleteProject", payloadFunctions.prepareDeleteProjectPayload),
};

async function listProjects(codeBuildClient, params) {
  const payload = payloadFunctions.prepareListProjectsPayload(params);

  const projects = await fetchRecursively(
    codeBuildClient,
    {
      methodName: "listProjects",
      outputDataPath: "projects",
    },
    payload,
  ).catch((error) => {
    throw new Error(`Failed to list projects: ${error.message || JSON.stringify(error)}`);
  });

  return { projects };
}

async function listBuilds(codeBuildClient, params) {
  const payload = payloadFunctions.prepareListBuildsPayload(params);
  const outputDataPath = "builds";

  let resultPromise;
  if (payload.project) {
    resultPromise = fetchRecursively(
      codeBuildClient,
      {
        methodName: "listBuildsForProject",
        outputDataPath,
      },
      payload,
    ).catch((error) => {
      throw new Error(`Failed to list builds: ${error.message || JSON.stringify(error)}`);
    });
  } else {
    resultPromise = fetchRecursively(
      codeBuildClient,
      {
        methodName: "listBuilds",
        outputDataPath,
      },
      _.omitBy(payload, "project"),
    ).catch((error) => {
      throw new Error(`Failed to list builds: ${error.message || JSON.stringify(error)}`);
    });
  }

  const builds = await resultPromise;

  return { builds };
}

module.exports = awsPluginLibrary.bootstrap(
  AWS.CodeBuild,
  {
    ...simpleAwsMethods,
    listProjects,
    listBuilds,
  },
  {
    listRegions: awsPluginLibrary.autocomplete.listRegions,
    ...autocomplete,
  },
  {
    ACCESS_KEY: "accessKeyId",
    SECRET_KEY: "secretAccessKey",
    REGION: "region",
  },
);
