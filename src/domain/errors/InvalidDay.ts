import {type CustomError} from '../protocols/CustomError';

export class InvalidDay extends Error implements CustomError {
	constructor() {
		super('Saturday or sunday schedules are not allowed as work day');
	}

	get ptBr() {
		return 'Sábado e domingo não são permitidos como dia de trabalho';
	}
}
