import {type Response} from '../protocols/Controller';

export class ResponseUtils {
	static success(body: Record<string, any>): Response {
		return {
			statusCode: 200,
			body,
		};
	}

	static created(body?: unknown): Response {
		return {
			statusCode: 201,
			body,
		};
	}

	static badRequest(data: string): Response {
		return {
			statusCode: 400,
			body: {mensagem: data},
		};
	}

	static notFoundError(data: string): Response {
		return {
			statusCode: 404,
			body: {mensagem: data},
		};
	}

	static conflict(data: string): Response {
		return {
			statusCode: 409,
			body: {mensagem: data},
		};
	}

	static internalServerError(): Response {
		return {
			statusCode: 500,
			body: {mensagem: 'Internal Server Error'},
		};
	}
}
