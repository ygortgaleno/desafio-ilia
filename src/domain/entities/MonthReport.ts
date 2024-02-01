import {type TimeSheetDatabaseDto} from '../dtos/TimeSheetDatabaseDto';
import {Entity} from '../protocols/Entity';

export class MonthReport extends Entity {
	monthYear: string;
	workedHours: string;
	overtimeHours: string;
	owedHours: string;
	hash: string;

	constructor(payload: Omit<MonthReport, 'toSnakeCase'>) {
		super();
		this.monthYear = payload.monthYear;
		this.workedHours = payload.workedHours;
		this.overtimeHours = payload.overtimeHours;
		this.owedHours = payload.owedHours;
		this.hash = payload.hash;
	}

	get toSnakeCase() {
		return this.convertFieldsToSnakeCase({
			monthYear: this.monthYear,
			workedHours: this.workedHours,
			overtimeHours: this.overtimeHours,
			owedHours: this.owedHours,
			hash: this.hash,
		});
	}
}
