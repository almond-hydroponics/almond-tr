export interface ICreateIssue {
	header: string;
	body: string;
	configurations: IConfigurations;
}

export interface IConfigurations {
	baseUrl: string;
	owner: string;
	repository: string;
	token: string;
}
