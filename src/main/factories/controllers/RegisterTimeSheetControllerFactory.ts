import {LoggerAdapter} from '../../../infrastructure/LoggerAdapter';
import {RegisterTimeSheetController} from '../../../presentation/controllers/RegisterTimeSheetController';
import {ValidateRegisterTimeSheetBody} from '../../../presentation/request_validator/ValidateRegisterTimeSheetBody';
import {RegisterTimeSheetServiceFactory} from '../services/RegisterTimeSheetServiceFactory';

export class RegisterTimeSheetControllerFactory {
	static create() {
		return new RegisterTimeSheetController({
			registerTimeSheet: RegisterTimeSheetServiceFactory.create(),
			requestValidator: new ValidateRegisterTimeSheetBody(),
			logger: new LoggerAdapter(),
		});
	}
}
