import {type Request} from './Controller';

export type RequestValidator = {
	validate(request: Request): void;
};
