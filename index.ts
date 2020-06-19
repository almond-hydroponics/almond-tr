const logger = require("./logger");
const request = require("request");
const path = require("path");
const TOKEN = process.env.GIT_HUB_ACCESS_TOKEN;
const OWNER = process.env.OWNER;
const REPO = process.env.GIT_HUB_REPOSITORY;
let GITHUB_URL = process.env.GIT_HUB_URL;

let headers = {
  Authorization: TOKEN,
  "User-Agent": "request",
};

function gitHubEndpoints() {
  let options = {
    url: GITHUB_URL,
    headers: headers,
  };

  try {
    request(options, (err, res, body) => {
      logger.success(body);
    });
  } catch (e) {
    console.log(e.message);
  }
}

function gitHubCreateIssue(header, body, conf) {
  GITHUB_URL = GITHUB_URL + `/repos/${OWNER}/${REPO}/issues`;

  let data = {
    title: header,
    body: body,
  };

  let options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };

  try {
    request.post(GITHUB_URL, options, (error, response, body) => {
      if (!error && response.statusCode == 201) {
        logger.success(body);
      }
    });
  } catch (e) {
    logger.err(e.message, e.stack);
  }
}

function gitHubGetIssues() {
  GITHUB_URL = GITHUB_URL + `/repos/${OWNER}/${REPO}/issues`;
  let options = {
    url: GITHUB_URL,
    headers: headers,
  };

  try {
    request(options, callback);
  } catch (e) {
    logger.err(e.message, e.stack);
  }
}

// @ts-ignore
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    logger.wrn(body);
  }
}

function issueBody(exception, stackTrace) {
  return `### Runtime Error Encountered
       \n INFO: ${exception} \n
      **Error:**
     ${stackTrace}`;
}

function issueHeading(funcName) {
  return `Fix:(Bug) Runtime Error on line  (${funcName})  ${process.env.APPLICATION_NAME}`;
}

function getCallerFile() {
  let directory = __dirname;
  let filename = path.basename(__filename);
  return directory + "/" + filename;
}

module.exports = {
  gitHubEndpoints,
  gitHubCreateIssue,
  callback,
  issueBody,
  issueHeading,
  gitHubGetIssues,
  getCallerFile,
};