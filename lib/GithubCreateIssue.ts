import logger from './logger';
import { ICreateIssue } from './types';
import CheckDuplicateIssues from './CheckDuplicateIssues';
import { createIssue } from './helpers';
import { AxiosRequestConfig } from 'axios';

interface IData {
	title: string;
	body: string;
}

const GitHubCreateIssue = async ({
	header,
	body,
	configurations,
}: ICreateIssue): Promise<void> => {
	const { baseUrl, owner, repository, token } = configurations;
	const issueExist = await CheckDuplicateIssues(configurations, body);
	const githubUrl = `${baseUrl}/repos/${owner}/${repository}/issues`;

	const data: IData = {
		title: header,
		body: body,
	};

	const options: AxiosRequestConfig = {
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
		logger.info('CREATING ISSUE');
		createIssue(options).then((response) => {
			logger.info('DONE CREATING ISSUE');
			return response;
		});
	} else {
		logger.warn('ISSUE ALREADY EXIST !');
	}
};

export default GitHubCreateIssue;
