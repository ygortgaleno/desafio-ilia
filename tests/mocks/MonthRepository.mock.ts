/* eslint-disable @typescript-eslint/naming-convention */
import {MonthReportDatabaseDto} from '../../src/domain/dtos/MonthReportDatabaseDto';
import {type MonthReport} from '../../src/domain/entities/MonthReport';
import {type MonthReportRepository} from '../../src/domain/protocols/MonthReportRepository';

export class MonthRepositoryMock implements MonthReportRepository {
	async create(payload: MonthReport): Promise<MonthReportDatabaseDto> {
		const payloadSnakeCase = payload.toSnakeCase as Omit<MonthReportDatabaseDto, 'id'>;

		return new MonthReportDatabaseDto({
			id: 1,
			...payloadSnakeCase,
		});
	}

	async find(payload: {monthYear: string}): Promise<MonthReportDatabaseDto | undefined> {
		return new MonthReportDatabaseDto({
			id: 1,
			month_year: payload.monthYear,
			overtime_hours: '00:00:00',
			owed_hours: '00:00:00',
			worked_hours: '00:00:00',
			hash: 'test',
		});
	}

	async update(id: number, payload: MonthReport): Promise<MonthReportDatabaseDto> {
		return new MonthReportDatabaseDto({
			id,
			month_year: payload.monthYear,
			overtime_hours: payload.overtimeHours,
			owed_hours: payload.owedHours,
			worked_hours: payload.workedHours,
			hash: payload.hash,
		});
	}
}
