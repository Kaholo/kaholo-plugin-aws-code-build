const payloadFunctions = require("./payload-functions");
const { fetchRecursively, splitArrayIntoChunks } = require("./helpers");

async function listProjects(codeBuildClient, params) {
  const payload = payloadFunctions.prepareListProjectsPayload(params);

  try {
    const projects = await fetchRecursively(
      codeBuildClient,
      {
        methodName: "listProjects",
        outputDataPath: "projects",
      },
      payload,
    );

    return { projects };
  } catch (error) {
    throw new Error(`Failed to list projects: ${error.message || JSON.stringify(error)}`);
  }
}

async function listBuilds(codeBuildClient, params) {
  const payload = payloadFunctions.prepareListBuildsPayload(params);

  let buildIds;
  try {
    buildIds = await fetchRecursively(
      codeBuildClient,
      {
        methodName: payload.projectName ? "listBuildsForProject" : "listBuilds",
        outputDataPath: "ids",
      },
      payload,
    );
  } catch (error) {
    throw new Error(`Failed to list build ids: ${error.message || JSON.stringify(error)}`);
  }

  const buildIdsChunks = splitArrayIntoChunks(buildIds, 100);

  const buildChunks = await Promise.all(buildIdsChunks.map((buildIdsChunk) => (
    codeBuildClient.batchGetBuilds({ ids: buildIdsChunk }).promise()
  )));
  const builds = buildChunks.reduce((acc, cur) => ({
    builds: acc.builds.concat(cur.builds),
    buildsNotFound: acc.buildsNotFound.concat(cur.buildsNotFound),
  }), {
    builds: [],
    buildsNotFound: [],
  });

  const filterByStatus = (build) => (
    !params.status
    || params.status === "ALL"
    || build.buildStatus === params.status
  );
  builds.builds = builds.builds.filter(filterByStatus);
  builds.buildsNotFound = builds.buildsNotFound.filter(filterByStatus);

  return builds;
}

module.exports = {
  listBuilds,
  listProjects,
};
