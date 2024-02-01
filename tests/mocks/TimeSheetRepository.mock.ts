/* eslint-disable @typescript-eslint/naming-convention */
import {TimeSheetDatabaseDto} from '../../src/domain/dtos/TimeSheetDatabaseDto';
import {type TimeSheet} from '../../src/domain/entities/TimeSheet';
import {type TimeSheetRepository} from '../../src/domain/protocols/TimeSheetRepository';

export class TimeSheetRepositoryMock implements TimeSheetRepository {
	async create(payload: TimeSheet): Promise<TimeSheetDatabaseDto> {
		const payloadSnakeCase = payload.toSnakeCase as Omit<TimeSheetDatabaseDto, 'id'>;

		return new TimeSheetDatabaseDto({
			id: 1,
			...payloadSnakeCase,
		});
	}

	async find(payload: {date: string}): Promise<TimeSheetDatabaseDto | undefined> {
		return new TimeSheetDatabaseDto({
			id: 1,
			date: payload.date,
			hours: ['08:00:00', '12:00:00', '13:00:00', '18:00:00'],
			worked_hours: '08:00:00',
		});
	}

	async list(payload: {monthYear: string}): Promise<TimeSheetDatabaseDto[]> {
		return [new TimeSheetDatabaseDto({
			id: 1,
			date: payload.monthYear,
			hours: ['08:00:00', '12:00:00', '13:00:00', '18:00:00'],
			worked_hours: '08:00:00',
		})];
	}

	async update(id: number, payload: TimeSheet): Promise<TimeSheetDatabaseDto> {
		return new TimeSheetDatabaseDto({
			id,
			date: payload.date,
			hours: payload.hours,
			worked_hours: payload.workedHours,
		});
	}
}
