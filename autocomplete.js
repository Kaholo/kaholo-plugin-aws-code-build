const awsPluginLibrary = require("@kaholo/aws-plugin-library");
const { listBuilds } = require("./code-commit-list-functions");
const { fetchRecursively } = require("./helpers");

function createAwsAutocompleteFunction(methodName, outputDataPath) {
  return async (query, params, awsClient) => {
    const fetchResult = await fetchRecursively(awsClient, {
      methodName,
      outputDataPath,
    }).catch((error) => {
      throw new Error(`Failed to list ${outputDataPath.toLowerCase()}: ${error.message || JSON.stringify(error)}`);
    });

    const mappedAutocompleteItems = fetchResult.map((fetchedItem) => (
      awsPluginLibrary.autocomplete.toAutocompleteItemFromPrimitive(fetchedItem)
    ));

    return awsPluginLibrary.autocomplete.filterItemsByQuery(mappedAutocompleteItems, query);
  };
}

function createListBuildsAutocomplete(status) {
  return async (query, params, codeBuildClient) => {
    const { builds } = await listBuilds(codeBuildClient, {
      project: params.project,
      status,
    });

    const mappedBuilds = builds.map((build) => (
      awsPluginLibrary.autocomplete.toAutocompleteItemFromPrimitive(build.id)
    ));

    return awsPluginLibrary.autocomplete.filterItemsByQuery(mappedBuilds, query);
  };
}

module.exports = {
  listProjectsAuto: createAwsAutocompleteFunction("listProjects", "projects"),
  listBuildsAuto: createListBuildsAutocomplete("ALL"),
  listBuildsInProgressAuto: createListBuildsAutocomplete("IN_PROGRESS"),
};
