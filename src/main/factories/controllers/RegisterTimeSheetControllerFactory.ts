import {RegisterTimeSheetController} from '../../../presentation/controllers/RegisterTimeSheetController';
import {ValidateRegisterTimeSheetBody} from '../../../presentation/request_validator/ValidateRegisterTimeSheetBody';
import {RegisterTimeSheetServiceFactory} from '../services/RegisterTimeSheetServiceFactory';
import {loggerAdapter} from '../singleton/LoggerAdapterFactory';

export class RegisterTimeSheetControllerFactory {
	static create() {
		return new RegisterTimeSheetController({
			registerTimeSheet: RegisterTimeSheetServiceFactory.create(),
			requestValidator: new ValidateRegisterTimeSheetBody(),
			logger: loggerAdapter,
		});
	}
}
