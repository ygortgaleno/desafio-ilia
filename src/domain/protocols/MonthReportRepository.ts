import {type MonthReportDatabaseDto} from '../dtos/MonthReportDatabaseDto';
import {type MonthReport} from '../entities/MonthReport';

export type MonthReportRepository = {
	create(payload: MonthReport): Promise<MonthReportDatabaseDto>;
	find(payload: {monthYear: string}): Promise<MonthReportDatabaseDto | undefined>;
	update(id: number, payload: MonthReport): Promise<MonthReportDatabaseDto>;
};
