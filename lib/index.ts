import axios, { AxiosRequestConfig } from 'axios';
import md from 'md5';
import logger from './logger';

interface ICreateIssue {
	header: string;
	body: string;
	configurations: IConfigurations;
}

interface IConfigurations {
	baseUrl: string;
	owner: string;
	repository: string;
	token: string;
}

let options: AxiosRequestConfig;

const gitHubEndpoints = async (token: string): Promise<any> => {
	options = {
		url: 'https://api.github.com',
		headers: {
			Authorization: token,
			'User-Agent': 'request',
		},
	};
	try {
		return axios(options);
	} catch (error) {
		logger.error(error.message);
	}
};

const gitHubCreateIssue = async ({
	header,
	body,
	configurations,
}: ICreateIssue): Promise<any> => {
	const { baseUrl, owner, repository, token } = configurations;
	const issueExist = await compareWithRemote(configurations, body);
	const githubUrl = `${baseUrl}/repos/${owner}/${repository}/issues`;

	const data = {
		title: header,
		body: body,
	};

	options = {
		url: githubUrl,
		method: 'post',
		headers: {
			Authorization: token,
			'User-Agent': 'request',
		},
		data: JSON.stringify(data),
	};

	if (!issueExist) {
		logger.warn('ISSUE DOES NOT EXIST!');
		logger.warn('CREATING...');
		createIssueAsync(options).then((response) => {
			logger.warn('**DONE CREATING**');
			return response;
		});
	} else {
		logger.warn('ISSUE ALREADY EXIST !');
	}
};

const createIssueAsync = async (options: AxiosRequestConfig): Promise<any> => {
	try {
		return axios(options);
	} catch (e) {
		logger.error(e.message, e.stack);
	}
};

const gitHubGetIssues = async ({
	baseUrl,
	owner,
	repository,
	token,
}: IConfigurations): Promise<any> => {
	const githubUrl = `${baseUrl}/repos/${owner}/${repository}/issues`;
	options = {
		url: githubUrl,
		headers: {
			Authorization: token,
			'User-Agent': 'request',
		},
	};

	try {
		return axios(options);
	} catch (e) {
		logger.error(e.message, e.stack);
	}
};

const issueBody = (exception: string, stackTrace: string): string => {
	return `### Messages : ${exception}

  #### Currently on : 12345 test

  + **Commit** :  default/bug/trace/try catch
  + **File Trace** :    ${stackTrace}
  + **Trace** : ${stackTrace}`;
};

const compareWithRemote = async (
	configurations: IConfigurations,
	body: string,
): Promise<any> => {
	let match = false;
	const response = await gitHubGetIssues(configurations);
	const issues = response.data;
	if (issues.length > 0) {
		for (let i = 0; i < issues.length; i++) {
			const x = issues[i].body as string;
			const remote = singleLineString(x);
			const local = singleLineString(body);

			logger.info(`Remote Issue : ${remote}`);
			logger.info(`Local Issue : ${local}`);
			match = compareLongString(remote, local);
			if (match) break;
		}
	}
	return match;
};

const issueHeading = (funcName: string, appName: string): string => {
	return `Fix:(Bug) Runtime Error application name : ${appName}  function name :  ${funcName}  on : ${new Date()}`;
};

const compareLongString = (
	stringOne: string | Buffer | number[],
	stringTwo: string | Buffer | number[],
) => {
	const one = md(stringOne);
	const two = md(stringTwo);
	logger.info(`HASH 1 : ${one}`);
	logger.info(`HASH 2 : ${two}`);
	return one === two;
};

const singleLineString = (strings: string | string[], ...values: any[]) => {
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

export {
	gitHubEndpoints,
	gitHubCreateIssue,
	issueBody,
	issueHeading,
	gitHubGetIssues,
};
