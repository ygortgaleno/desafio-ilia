import {Entity} from '../protocols/Entity';

export class TimeSheet extends Entity {
	date: string;
	hours: string[];
	workedHours: string;

	constructor(payload: Omit<TimeSheet, 'toSnakeCase'>) {
		super();
		this.date = payload.date;
		this.hours = payload.hours;
		this.workedHours = payload.workedHours;
	}

	get toSnakeCase() {
		return this.convertFieldsToSnakeCase({
			date: this.date,
			hours: this.hours,
			workedHours: this.workedHours,
		});
	}
}
