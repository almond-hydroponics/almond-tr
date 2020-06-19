# git-bug-trace

Powerful bug profiling and tracking library. Automatically creates github issues

_git-bug-trace is a simple library integrated with GitHub. It collects fatal errors caught on catch blocks at runtime and creates issues automatically to respective application repository_

---

## Install

```
$ npm install git-bug-trace -g
```

or

```
$ yarn add git-bug-trace
```

## Usage

Keep track of bugs that are encountered on runtime in almond production services.

## Getting started

```ts
// create a .env file with the following constants

let GIT_HUB_ACCESS_TOKEN,
  APPLICATION_NAME,
  OWNER,
  GIT_HUB_REPOSITORY,
  GIT_HUB_URL;

OWNER = "<Repository Owner>";
GIT_HUB_REPOSITORY = "<Your Repository>";
GIT_HUB_URL = "<Git Hub API base Url>";
GIT_HUB_ACCESS_TOKEN = "<token XXXXXXXXXXXXXXXXXXXXXXXXXXXX>";
APPLICATION_NAME = "<your application name>";

// init before usage
const almond = require("git-bug-trace");
```

## Module

This Module exposes the following functions which are helper functions to enable issues to be logged automatically to github

```ts
module.exports = {
  gitHubEndpoints,
  gitHubCreateIssue,
  callback,
  issueBody,
  issueHeading,
  gitHubGetIssues,
  getCallerFile,
};
```

### examples

#### Creating GitHubIssues

```ts
almond.gitHubCreateIssue(almond.issueHeading(almond.getCallerFile()),almond.issueBody('<Your Exception Message>','<Your Exception stack>'),<any other Object to attach>);

```

#### Listing GitHubIssues

```ts
almond.gitHubGetIssues();
```

#### Listing GitHubEndpoints

```ts
almond.gitHubEndpoints();
```

## LISENCE

<p> Copyright &copy; 2020 </p>
Almond Smart Farm. Licensed under the MIT license.

**_ 🅰🅻🅼🅾🅽🅳 _**
