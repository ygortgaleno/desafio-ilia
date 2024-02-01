/* eslint-disable @typescript-eslint/naming-convention */
import {TimeSheetDatabaseDto} from '../../domain/dtos/TimeSheetDatabaseDto';
import {type TimeSheet} from '../../domain/entities/TimeSheet';
import {type TimeSheetRepository} from '../../domain/protocols/TimeSheetRepository';
import type knex from 'knex';

export class TimeSheetRepositoryAdapter implements TimeSheetRepository {
	constructor(private readonly dbConnection: knex.Knex<any, unknown[]>) {}

	async create(payload: TimeSheet): Promise<TimeSheetDatabaseDto> {
		const timeSheet = (await this.dbConnection<TimeSheetDatabaseDto>('time_sheet')
			.insert(payload.toSnakeCase)
			.returning('*'))[0];

		return new TimeSheetDatabaseDto({
			date: this.getDateWithoutTime(timeSheet.date),
			hours: timeSheet.hours,
			id: timeSheet.id,
			worked_hours: timeSheet.worked_hours,
		});
	}

	async find(payload: {date: string}): Promise<TimeSheetDatabaseDto | undefined> {
		const timeSheet = (await this.dbConnection<Omit<TimeSheetDatabaseDto, 'ptBr'>>('time_sheet')
			.where(payload).first());

		if (timeSheet) {
			return new TimeSheetDatabaseDto({
				date: this.getDateWithoutTime(timeSheet.date),
				hours: timeSheet.hours,
				id: timeSheet.id,
				worked_hours: timeSheet.worked_hours,
			});
		}
	}

	async update(id: number, payload: TimeSheet): Promise<TimeSheetDatabaseDto> {
		const timeSheet = (await this.dbConnection<Omit<TimeSheetDatabaseDto, 'ptBr'>>('time_sheet')
			.update(payload.toSnakeCase).where({id}).returning('*'))[0];

		return new TimeSheetDatabaseDto({
			date: this.getDateWithoutTime(timeSheet.date),
			hours: timeSheet.hours,
			id: timeSheet.id,
			worked_hours: timeSheet.worked_hours,
		});
	}

	async list(payload: {monthYear: string}): Promise<TimeSheetDatabaseDto[]> {
		const [year, month] = payload.monthYear.split('-');
		const [initialDate, endDate] = [
			new Date(Number(year), Number(month) - 1, 1).toISOString().split('T')[0],
			new Date(Number(year), Number(month), 0).toISOString().split('T')[0],
		];
		const timeSheets = await this.dbConnection<Omit<TimeSheetDatabaseDto, 'ptBr'>>('time_sheet')
			.whereBetween('date', [initialDate, endDate])
			.orderBy('id');

		return timeSheets.map(t => new TimeSheetDatabaseDto({
			id: t.id,
			date: this.getDateWithoutTime(t.date),
			hours: t.hours,
			worked_hours: t.worked_hours,
		}));
	}

	private getDateWithoutTime(date: string) {
		return date.split('T')[0];
	}
}
