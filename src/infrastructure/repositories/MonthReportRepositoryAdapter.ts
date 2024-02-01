/* eslint-disable @typescript-eslint/naming-convention */
import type knex from 'knex';
import {MonthReportDatabaseDto} from '../../domain/dtos/MonthReportDatabaseDto';
import {type MonthReport} from '../../domain/entities/MonthReport';
import {type MonthReportRepository} from '../../domain/protocols/MonthReportRepository';

export class MonthReportRepositoryAdapter implements MonthReportRepository {
	constructor(private readonly dbConnection: knex.Knex<any, unknown[]>) {}

	async create(payload: MonthReport): Promise<MonthReportDatabaseDto> {
		const monthReportDto = (await this.dbConnection<Omit<MonthReportDatabaseDto, 'ptBr'>>(this.tableName)
			.insert(payload.toSnakeCase)
			.returning('*')
		)[0];
		return new MonthReportDatabaseDto(monthReportDto);
	}

	async find(payload: {monthYear: string}): Promise<MonthReportDatabaseDto | undefined> {
		const monthReportDto = (await this.dbConnection<Omit<MonthReportDatabaseDto, 'ptBr'>>(this.tableName)
			.where({month_year: payload.monthYear})
		).at(0);

		if (!monthReportDto) {
			return;
		}

		return new MonthReportDatabaseDto(monthReportDto);
	}

	async update(id: number, payload: MonthReport): Promise<MonthReportDatabaseDto> {
		const monthReportDatabaseDto = (await this.dbConnection<Omit<MonthReportDatabaseDto, 'ptBr'>>(this.tableName)
			.update(payload.toSnakeCase).where({id}).returning('*'))[0];

		return new MonthReportDatabaseDto(monthReportDatabaseDto);
	}

	private get tableName() {
		return 'month_report';
	}
}
