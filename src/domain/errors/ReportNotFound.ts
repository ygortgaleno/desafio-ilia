import {type CustomError} from '../protocols/CustomError';

export class ReportNotFound extends Error implements CustomError {
	constructor() {
		super('Report not found');
	}

	get ptBr() {
		return 'Relatório não encontrado';
	}
}
