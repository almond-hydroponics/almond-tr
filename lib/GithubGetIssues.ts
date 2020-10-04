import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import logger from './logger';
import { IConfigurations } from './types';

const GitHubGetIssues = async ({
	baseUrl,
	owner,
	repository,
	token,
}: IConfigurations): Promise<AxiosResponse | any> => {
	const githubUrl = `${baseUrl}/repos/${owner}/${repository}/issues`;
	const options: AxiosRequestConfig = {
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

export default GitHubGetIssues;
