import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import logger from './logger';

const GitHubEndpoints = async (
	token: string,
): Promise<AxiosResponse | void> => {
	const options: AxiosRequestConfig = {
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

export default GitHubEndpoints;
