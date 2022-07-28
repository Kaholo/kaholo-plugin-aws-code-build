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

function splitArrayIntoChunks(array, chunkSize) {
  return array.reduce((acc, cur) => {
    const lastChunk = acc[acc.length - 1];
    if (lastChunk.length < chunkSize) {
      lastChunk.push(cur);
    } else {
      acc.push([cur]);
    }
    return acc;
  }, [[]]);
}

module.exports = {
  splitArrayIntoChunks,
  fetchRecursively,
};
