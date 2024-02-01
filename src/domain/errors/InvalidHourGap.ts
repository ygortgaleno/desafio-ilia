import {type CustomError} from '../protocols/CustomError';

export class InvalidHourGap extends Error implements CustomError {
	constructor() {
		super('There must be at least 1 hour of lunch');
	}

	get ptBr() {
		return 'Deve haver no mínimo 1 hora de almoço';
	}
}
