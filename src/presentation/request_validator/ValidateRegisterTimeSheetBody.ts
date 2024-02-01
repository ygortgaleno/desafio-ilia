import {InvalidFormat} from '../../domain/errors/InvalidFormat';
import {type Request} from '../protocols/Controller';
import {type RequestValidator} from '../protocols/RequestValidator';

export class ValidateRegisterTimeSheetBody implements RequestValidator {
	validate(request: Request) {
		if (!(request.body instanceof Object) || Array.isArray(request.body)) {
			throw new InvalidFormat({
				en: 'Request body',
				ptBr: 'Corpo da requisição',
			});
		}

		const body: Record<string, any> = request.body as Record<string, any>;
		if (!Object.keys(body).includes('momento')) {
			throw new InvalidFormat({
				en: '\'momento\' field',
				ptBr: 'Campo \'momento\'',
			});
		}

		if (
			!/\d{4}(-\d{2}){2}T\d{2}(:\d{2}){2}Z?/.test(body.momento as string)
            || isNaN(new Date(body.momento as string).getTime())
		) {
			throw new InvalidFormat({
				en: 'Date and hour',
				ptBr: 'Data e hora',
			});
		}
	}
}
