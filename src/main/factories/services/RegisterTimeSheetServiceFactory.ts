import {RegisterTimeSheet} from '../../../domain/services/RegisterTimeSheet';
import {HoursManagerAdapter} from '../../../domain/utils/HoursManagerAdapter';
import {TimeSheetRepositoryAdapter} from '../../../infrastructure/repositories/TimeSheetRepositoryAdapter';
import {databaseConnection} from '../singleton/DatabaseConnectionFactory';

export class RegisterTimeSheetServiceFactory {
	static create() {
		return new RegisterTimeSheet({
			timeSheetRepository: new TimeSheetRepositoryAdapter(databaseConnection),
			hoursManager: new HoursManagerAdapter(),
		});
	}
}
