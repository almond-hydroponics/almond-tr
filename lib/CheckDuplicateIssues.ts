import logger from './logger';
import { IConfigurations } from './types';
import { compareLongString, singleLineString } from './helpers';
import GitHubGetIssues from './GithubGetIssues';

const CheckDuplicateIssues = async (
	configurations: IConfigurations,
	body: string,
): Promise<boolean> => {
	let match = false;
	const response = await GitHubGetIssues(configurations);
	const issues = response?.data;
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

export default CheckDuplicateIssues;
