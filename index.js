const logger = require("./logger");
const axios = require("axios");
const path = require("path");

const TOKEN = process.env.GIT_HUB_ACCESS_TOKEN;
const OWNER = process.env.OWNER;
const REPO = process.env.GIT_HUB_REPOSITORY;
let GITHUB_URL = process.env.GIT_HUB_URL;

let headers = {
  Authorization: TOKEN,
  "User-Agent": "request",
};

async function gitHubEndpoints(token) {
  let options = {
    url: "https://api.github.com",
    headers: {
      Authorization: token,
      "User-Agent": "request",
    },
  };
  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

async function gitHubCreateIssue(header, body, configurations) {
  const GITHUB_URL =
    configurations.base_url +
    `/repos/${configurations.owner}/${configurations.repository}/issues`;

  let data = {
    title: header,
    body: body,
  };

  let options = {
    url: GITHUB_URL,
    method: "post",
    headers: {
      Authorization: configurations.token,
      "User-Agent": "request",
    },
    data: JSON.stringify(data),
  };

  try {
    const response = await axios(options);
    return response;
  } catch (e) {
    logger.err(e.message, e.stack);
  }
}

async function gitHubGetIssues(configurations) {
  const GITHUB_URL =
    configurations.base_url +
    `/repos/${configurations.owner}/${configurations.repository}/issues`;
  let options = {
    url: GITHUB_URL,
    headers: {
      Authorization: configurations.token,
      "User-Agent": "request",
    },
  };

  try {
    const response = await axios(options);
    return response;
  } catch (e) {
    logger.err(e.message, e.stack);
  }
}

function issueBody(exception, stackTrace) {
  return `#### Message: ${exception} 

  #### Currently on:

  + **Commit**:  default/bug/trace/try catch
  + **File Trace**:    ${stackTrace}
  + **Trace**: ${stackTrace}`;
}

function issueHeading(funcName, appName) {
  return `Fix:(Bug) Runtime Error application name : ${appName}  function name :  ${funcName} `;
}

module.exports = {
  gitHubEndpoints,
  gitHubCreateIssue,
  issueBody,
  issueHeading,
  gitHubGetIssues,
};
