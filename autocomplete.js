const awsPluginLibrary = require("kaholo-aws-plugin-library");
const { fetchRecursively } = require("./helpers");

async function createAwsAutocompleteFunction(
  methodName,
  outputDataPath,
  [valuePath, labelPath] = [],
) {
  return async (query, params, awsClient) => {
    const fetchResult = await fetchRecursively(awsClient, {
      methodName,
      outputDataPath,
    }).catch((error) => {
      throw new Error(`Failed to list ${outputDataPath.toLowerCase()}: ${error.message || JSON.stringify(error)}`);
    });

    const mappedAutocompleteItems = fetchResult.map((fetchedItem) => {
      const autocompleteValue = valuePath ? fetchedItem[valuePath] : fetchedItem;
      const autocompleteLabel = labelPath ? fetchedItem[labelPath] : autocompleteValue;
      return awsPluginLibrary.autocomplete.toAutocompleteItemFromPrimitive(
        autocompleteValue,
        autocompleteLabel,
      );
    });

    return awsPluginLibrary.autocomplete.filterItemsByQuery(mappedAutocompleteItems, query);
  };
}

module.exports = {
  listProjectsAuto: createAwsAutocompleteFunction("listProjects", "projects"),
  listBuildsAuto: createAwsAutocompleteFunction("listBuilds", "ids"),
};
