import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const options = {
	file: {
		level: 'info' || 'error',
		filename: `${__dirname}/../logs/app.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880,
		maxFiles: 5,
		colorize: true,
	},
};

const logger = createLogger({
	level: 'info',
	format: combine(
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.splat(),
		format.json(),
		printf(
			({ level, message, label, timestamp }) =>
				`${timestamp} [${label}] ${level.toUpperCase()} - ${message}`,
		),
	),
	transports: [
		process.env.NODE_ENV !== 'development'
			? new transports.File(options.file)
			: new transports.Console({
					format: format.combine(format.cli(), format.splat()),
			  }),
	],
});

export default logger;

// let chalk = require('chalk');
// const log = console.log;
// const error = chalk.redBright.bgWhite.bold;
// const warning = chalk.keyword('orange');
// const suc = chalk.keyword('green');
// const info = chalk.blueBright;
// const text = chalk.whiteBright.bgHex('#146907');
//
// let err = function(msg, stack) {
//   return log(error(`Encountered an Error : ${msg} \n Error Details ${stack}`));
// };
//
// let wrn = function(msg) {
//   return log(warning(msg));
// };
//
// let inf = function(msg) {
//   return log(info(msg));
// };
// let success = function(msg) {
//   return log(suc(msg));
// };
//
// let txt = function(msg) {
//   return log(text(msg));
// };
//
// module.exports = {
//   err,
//   inf,
//   wrn,
//   success,
//   txt,
// };
