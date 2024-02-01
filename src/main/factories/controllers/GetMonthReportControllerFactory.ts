import {GetMonthReportController} from '../../../presentation/controllers/GetMonthReportController';
import {ValidateGetMonthParameter} from '../../../presentation/request_validator/ValidateGetMonthParameter';
import {GetMonthReportServiceFactory} from '../services/GetMonthReportServiceFactory';
import {loggerAdapter} from '../singleton/LoggerAdapterFactory';

export class GetMonthReportControllerFactory {
	static create() {
		return new GetMonthReportController({
			getMonthReport: GetMonthReportServiceFactory.create(),
			validateRequestParams: new ValidateGetMonthParameter(),
			logger: loggerAdapter,
		});
	}
}
