const parsers = require("./parsers");
const CodeBuildService = require('./aws.codebuild.service');
const MAX_RESULTS = 10;

// auto complete helper methods

function mapAutoParams(autoParams){
  const params = {};
  autoParams.forEach(param => {
    params[param.name] = parsers.autocomplete(param.value);
  });
  return params;
}

/***
 * @returns {[{id, value}]} filtered result items
 ***/
function handleResult(result, query, keyField, valField){
  if (!result || result.length == 0) return [];
  if (!keyField) {
    keyField = "id";
    valField = "name";
  }
  const items = result.map(item => getAutoResult(item[keyField], item[valField]));
  return filterItems(items, query);
}

/***
 * @returns {{id, value}} formatted autocomplete item
 ***/
function getAutoResult(id, value) {
  return {
    id: id || value,
    value: value || id
  };
}

function filterItems(items, query){
  if (query){
    const qWords = query.split(/[. ]/g).map(word => word.toLowerCase()); // split by '.' or ' ' and make lower case
    items = items.filter(item => qWords.every(word => item.value.toLowerCase().includes(word)));
    items = items.sort((word1, word2) => word1.value.toLowerCase().indexOf(qWords[0]) - word2.value.toLowerCase().indexOf(qWords[0]));
  }
  return items.splice(0, MAX_RESULTS);
}

function listAuto(listFuncName, fields) {
  return async (query, pluginSettings, triggerParameters) => {
    const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters);
    const client = CodeBuildService.from(params, settings);
    const result = await client[listFuncName](params);
    const items = handleResult(result, query, ...fields);
    return items;
  }
}

async function listProjectsAuto(query, pluginSettings, triggerParameters){
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters);
  const client = CodeBuildService.from(params, settings);
  var result = await client.listProjects({});
  const items = filterItems(result.projects.map(project => getAutoResult(project)), query);
  while (items.length < MAX_RESULTS && result.nextToken){
    result = await client.listProjects({nextToken: result.nextToken});
    items.push(...filterItems(result.projects.map(project => getAutoResult(project)), query));
  }
  return items;
}

async function listBuildsAuto(query, pluginSettings, triggerParameters){
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters);
  const client = CodeBuildService.from(params, settings);
  var result = await client.listBuilds({project: params.project});
  const items = filterItems(result.ids.map(buildId => getAutoResult(buildId)), query);
  while (items.length < MAX_RESULTS && result.nextToken){
    result = await client.listBuilds({
      project: params.project, 
      nextToken: result.nextToken
    });
    items.push(...filterItems(result.ids.map(buildId => getAutoResult(buildId)), query));
  }
  return items;
}

module.exports = {
  listRegionsAuto: listAuto("listRegions", ["RegionName"]),
  listProjectsAuto,
  listBuildsAuto
}
