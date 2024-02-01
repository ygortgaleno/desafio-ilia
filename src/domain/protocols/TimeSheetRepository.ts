import {type TimeSheetDatabaseDto} from '../dtos/TimeSheetDatabaseDto';
import {type TimeSheet} from '../entities/TimeSheet';

export type TimeSheetRepository = {
	create(payload: TimeSheet): Promise<TimeSheetDatabaseDto>;
	find(payload: {date: string}): Promise<TimeSheetDatabaseDto | undefined>;
	update(id: number, payload: TimeSheet): Promise<TimeSheetDatabaseDto>;
	list(payload: {monthYear: string}): Promise<TimeSheetDatabaseDto[]>;
};
