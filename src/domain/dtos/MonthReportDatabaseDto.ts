/* eslint-disable @typescript-eslint/naming-convention */
export class MonthReportDatabaseDto {
	id: number;
	month_year: string;
	worked_hours: string;
	overtime_hours: string;
	owed_hours: string;
	hash: string;

	constructor(payload: Omit<MonthReportDatabaseDto, 'ptBr'>) {
		this.id = payload.id;
		this.month_year = payload.month_year;
		this.worked_hours = payload.worked_hours;
		this.overtime_hours = payload.overtime_hours;
		this.owed_hours = payload.owed_hours;
		this.hash = payload.hash;
	}
}
