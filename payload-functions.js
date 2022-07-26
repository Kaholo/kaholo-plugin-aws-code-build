function prepareStartBuildPayload(params) {
  return {
    projectName: params.project,
    sourceVersion: params.sourceVersion,
    debugSessionEnabled: params.debugSessionEnabled,
  };
}

function prepareStopBuildPayload(params) {
  return {
    id: params.build,
  };
}

function prepareGetBuildsPayload(params) {
  return {
    ids: [params.builds],
  };
}

function prepareJsonProjectRelatedPayload(params) {
  return params.projectJson;
}

function prepareGetProjectPayload(params) {
  return {
    names: [params.project],
  };
}

function prepareDeleteProjectPayload(params) {
  return {
    name: params.project,
  };
}

function prepareListProjectsPayload() {
  return {
    sortBy: "LAST_MODIFIED_TIME",
    sortOrder: "DESCENDING",
  };
}

function prepareListBuildsPayload(params) {
  const payload = {};

  if (params.project) {
    payload.projectName = params.project;
  }

  return payload;
}

module.exports = {
  prepareStartBuildPayload,
  prepareStopBuildPayload,
  prepareGetBuildsPayload,
  prepareJsonProjectRelatedPayload,
  prepareGetProjectPayload,
  prepareDeleteProjectPayload,
  prepareListBuildsPayload,
  prepareListProjectsPayload,
};
