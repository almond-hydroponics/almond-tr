let chalk = require("chalk");
const log = console.log;
const error = chalk.redBright.bgWhite.bold;
const warning = chalk.keyword("orange");
const suc = chalk.keyword("green");
const info = chalk.blueBright;

let err = function (msg, stack) {
  return log(error(`Encountered an Error : ${msg} \n Error Details ${stack}`));
};

let wrn = function (msg) {
  return log(warning(msg));
};

let inf = function (msg) {
  return log(info(msg));
};
let success = function (msg) {
  return log(suc(msg));
};

module.exports = {
  err,
  inf,
  wrn,
  success,
};
