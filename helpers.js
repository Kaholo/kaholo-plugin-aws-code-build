const _ = require("lodash");
const { access, readFile, lstat } = require("fs/promises");

async function fetchRecursively(awsClient, fetchOptions = {}, payload = {}) {
  const methodPayload = { ...payload };
  if (fetchOptions.nextToken) {
    methodPayload.nextToken = fetchOptions.nextToken;
  }

  const fetchResult = await awsClient[fetchOptions.methodName](methodPayload).promise();
  const fetchedItems = fetchResult[fetchOptions.outputDataPath];

  if (!fetchResult.nextToken) {
    return fetchedItems;
  }

  const recursiveItems = await fetchRecursively(awsClient, {
    ...fetchOptions,
    nextToken: fetchResult.nextToken,
  }, payload);

  return fetchedItems.concat(recursiveItems);
}

async function resolveJsonConfigurationParam(jsonConfigParam) {
  if (_.isPlainObject(jsonConfigParam)) {
    return jsonConfigParam;
  }
  if (_.isString(jsonConfigParam)) {
    const rawConfig = await tryReadFileContent(jsonConfigParam);

    try {
      return JSON.parse(rawConfig);
    } catch (error) {
      throw new Error(`Failed to parse JSON configuration from file: ${error.message}`);
    }
  }

  throw new Error(`Unsupported JSON Configuration parameter type: ${JSON.stringify(jsonConfigParam)}`);
}

async function tryReadFileContent(filepath) {
  if (!await pathExists(filepath)) {
    throw new Error(`File ${filepath} does not exist!`);
  }

  const pathStat = await lstat(filepath);
  if (!pathStat.isFile()) {
    throw new Error(`Path ${filepath} is not a file`);
  }

  const fileContent = await readFile(filepath);
  return fileContent.toString();
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  resolveJsonConfigurationParam,
  fetchRecursively,
};
