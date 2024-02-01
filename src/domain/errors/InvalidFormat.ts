import {type CustomError} from '../protocols/CustomError';

export class InvalidFormat extends Error implements CustomError {
	private readonly field: Record<'en' | 'ptBr', string>;

	constructor(field: Record<'en' | 'ptBr', string>) {
		super(`${field.en} in invalid format`);
		this.field = field;
	}

	get ptBr() {
		return `${this.field.ptBr} em formato invalido`;
	}
}
