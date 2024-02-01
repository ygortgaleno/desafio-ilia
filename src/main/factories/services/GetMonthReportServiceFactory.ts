import {GetMonthReport} from '../../../domain/services/GetMonthReport';
import {HoursManagerAdapter} from '../../../domain/utils/HoursManagerAdapter';
import {MonthReportRepositoryAdapter} from '../../../infrastructure/repositories/MonthReportRepositoryAdapter';
import {TimeSheetRepositoryAdapter} from '../../../infrastructure/repositories/TimeSheetRepositoryAdapter';
import {databaseConnection} from '../singleton/DatabaseConnection';

export class GetMonthReportServiceFactory {
	static create() {
		return new GetMonthReport({
			manipulateHours: new HoursManagerAdapter(),
			monthReportRepository: new MonthReportRepositoryAdapter(databaseConnection),
			timeSheetRepository: new TimeSheetRepositoryAdapter(databaseConnection),
		});
	}
}
