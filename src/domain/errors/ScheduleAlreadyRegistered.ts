import {type CustomError} from '../protocols/CustomError';

export class ScheduleAlreadyRegistered extends Error implements CustomError {
	constructor() {
		super('Schedule Already Registered');
	}

	get ptBr() {
		return 'Horário já registrado';
	}
}
