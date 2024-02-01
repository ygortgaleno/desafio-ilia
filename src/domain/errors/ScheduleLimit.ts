import {type CustomError} from '../protocols/CustomError';

export class ScheduleLimit extends Error implements CustomError {
	constructor() {
		super('Only 4 schedules can be registered by day');
	}

	get ptBr() {
		return 'Apenas 4 horários podem ser registrados por dia';
	}
}
