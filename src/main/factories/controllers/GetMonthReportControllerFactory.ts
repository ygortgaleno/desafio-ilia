import {LoggerAdapter} from '../../../infrastructure/LoggerAdapter';
import {GetMonthReportController} from '../../../presentation/controllers/GetMonthReportController';
import {ValidateGetMonthParameter} from '../../../presentation/request_validator/ValidateGetMonthParameter';
import {GetMonthReportServiceFactory} from '../services/GetMonthReportServiceFactory';

export class GetMonthReportControllerFactory {
	static create() {
		return new GetMonthReportController({
			getMonthReport: GetMonthReportServiceFactory.create(),
			validateRequestParams: new ValidateGetMonthParameter(),
			logger: new LoggerAdapter(),
		});
	}
}
