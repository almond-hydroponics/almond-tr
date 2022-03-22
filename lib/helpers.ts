import md from 'md5';
import logger from './logger';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const compareLongString = (
	stringOne: string | Buffer | number[],
	stringTwo: string | Buffer | number[],
): boolean => {
	const one = md(stringOne);
	const two = md(stringTwo);
	logger.info(`HASH 1 : ${one}`);
	logger.info(`HASH 2 : ${two}`);
	return one === two;
};

export const singleLineString = (
	strings: string | string[],
	...values: string[]
): any => {
	// Interweave the strings with the
	// substitution vars first.
	let output = '';
	for (let i = 0; i < values.length; i++) {
		output += strings[i] + values[i];
	}
	output += strings[values.length];
	// Split on newlines.
	const lines = output.split(/(?:\r\n|\n|\r)/);

	// Rip out the leading whitespace.
	return lines
		.map((line) => {
			return line.replace(/^\s+/gm, '');
		})
		.join(' ')
		.trim();
};

export const createIssue = async (
	options: AxiosRequestConfig,
): Promise<AxiosResponse | void> => {
	try {
		return axios(options);
	} catch (e) {
		logger.error(e.message, e.stack);
	}
};

export const issueBody = (exception: string, stackTrace: string): string => {
	return `### Messages : ${exception}

  #### Currently on : 12345 test

  + **Commit** :  default/bug/trace/try catch
  + **File Trace** :    ${stackTrace}
  + **Trace** : ${stackTrace}`;
};

export const issueHeading = (funcName: string, appName: string): string => {
	return `Fix:(Bug) Runtime Error application name : ${appName}  function name :  ${funcName}  on : ${new Date()}`;
};
