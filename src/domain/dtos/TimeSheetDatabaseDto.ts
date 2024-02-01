/* eslint-disable @typescript-eslint/naming-convention */
export class TimeSheetDatabaseDto {
	id: number;
	date: string;
	hours: string[];
	worked_hours: string;

	constructor(payload: Omit<TimeSheetDatabaseDto, 'ptBr'>) {
		this.id = payload.id;
		this.date = payload.date;
		this.hours = payload.hours;
		this.worked_hours = payload.worked_hours;
	}
}
