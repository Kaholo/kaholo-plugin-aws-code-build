const awsPluginLibrary = require("@kaholo/aws-plugin-library");
const AWS = require("aws-sdk");

const autocomplete = require("./autocomplete");
const payloadFunctions = require("./payload-functions");
const {
  listBuilds,
  listProjects,
} = require("./code-commit-list-functions");

const simpleAwsMethods = {
  startBuild: awsPluginLibrary.generateAwsMethod("startBuild", payloadFunctions.prepareStartBuildPayload),
  stopBuild: awsPluginLibrary.generateAwsMethod("stopBuild", payloadFunctions.prepareStopBuildPayload),
  getBuilds: awsPluginLibrary.generateAwsMethod("batchGetBuilds", payloadFunctions.prepareGetBuildsPayload),
  createProjectFromJson: awsPluginLibrary.generateAwsMethod("createProject", payloadFunctions.prepareJsonProjectRelatedPayload),
  updateProjectFromJson: awsPluginLibrary.generateAwsMethod("updateProject", payloadFunctions.prepareJsonProjectRelatedPayload),
  getProject: awsPluginLibrary.generateAwsMethod("batchGetProjects", payloadFunctions.prepareGetProjectPayload),
  deleteProject: awsPluginLibrary.generateAwsMethod("deleteProject", payloadFunctions.prepareDeleteProjectPayload),
};

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
