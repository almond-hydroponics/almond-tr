const logger = require("./logger");
const axios = require("axios");
const path = require("path");
const md = require("md5");

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
  const issueExist = await compareWithRemote(configurations, body);
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

  if (!issueExist) {
    logger.wrn("ISSUE DOES NOT EXIST!");
    logger.wrn("CREATING...");
    createIssueAsync(options).then((res) => {
      logger.wrn("**DONE CREATING**");
      return res;
    });
  } else {
    logger.wrn("ISSUE ALREDY EXIST !");
  }
}

async function createIssueAsync(options) {
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
  return `### Message : ${exception} 

  #### Currently on : 12345 test
  #### Date Created : ${new Date()}

  + **Commit** :  default/bug/trace/try catch
  + **File Trace** :    ${stackTrace}
  + **Trace** : ${stackTrace}`;
}

async function compareWithRemote(configurations, body) {
  let match = false;
  const res = await gitHubGetIssues(configurations);
  let issues = res.data;
  if (issues.length > 0) {
    for (let i = 0; i < issues.length; i++) {
      let x = issues[i].body;
      let remote = singleLineString`${x}`;
      let local = singleLineString`${body}`;

      logger.txt("Remote Issue : " + remote);
      logger.txt("Local Issue : " + local);
      match = compareLongString(remote, local);
      if (match) {
        break;
      }
    }
  }
  return match;
}

function issueHeading(funcName, appName) {
  return `Fix:(Bug) Runtime Error application name : ${appName}  function name :  ${funcName} `;
}

function compareLongString(stringOne, stringTwo) {
  let one = md(stringOne);
  let two = md(stringTwo);
  logger.txt("HASH 1 : " + one);
  logger.txt("HASH 2 : " + two);
  if (one === two) {
    return true;
  } else {
    return false;
  }
}

function singleLineString(strings, ...values) {
  // Interweave the strings with the
  // substitution vars first.
  let output = "";
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i];
  }
  output += strings[values.length];
  // Split on newlines.
  let lines = output.split(/(?:\r\n|\n|\r)/);

  // Rip out the leading whitespace.
  return lines
    .map((line) => {
      return line.replace(/^\s+/gm, "");
    })
    .join(" ")
    .trim();
}

module.exports = {
  gitHubEndpoints,
  gitHubCreateIssue,
  issueBody,
  issueHeading,
  gitHubGetIssues,
};
