import {InvalidFormat} from '../../domain/errors/InvalidFormat';
import {type Request} from '../protocols/Controller';
import {type RequestValidator} from '../protocols/RequestValidator';

export class ValidateGetMonthParameter implements RequestValidator {
	validate(request: Request) {
		const {monthYear} = request.params;
		if (
			!/^\d{4}-\d{2}$/.test(monthYear as string)
            || isNaN(new Date(monthYear as string).getTime())
		) {
			throw new InvalidFormat({
				en: 'Date and hour',
				ptBr: 'Data e hora',
			});
		}
	}
}
