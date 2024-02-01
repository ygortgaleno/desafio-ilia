export type Request = {
	body: any;
	params: Record<string, any>;
};

export type Response = {
	statusCode: number;
	body: any;
};

export type Controller = {
	handle(request: Request): Promise<Response>;
};
