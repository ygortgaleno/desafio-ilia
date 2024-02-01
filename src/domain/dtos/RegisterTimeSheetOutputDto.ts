import {type OutputDto} from '../protocols/OutputDto';

export class RegisterTimeSheetOutputDto implements OutputDto {
	date: string;
	hours: string[];

	constructor(payload: Omit<RegisterTimeSheetOutputDto, 'ptBr'>) {
		this.date = payload.date;
		this.hours = payload.hours;
	}

	get ptBr() {
		return {
			dia: this.date,
			pontos: this.hours,
		};
	}
}
