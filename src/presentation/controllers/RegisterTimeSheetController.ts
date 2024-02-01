import {RegisterTimeShetInputDto} from '../../domain/dtos/RegisterTimeSheetInputDto';
import {ScheduleAlreadyRegistered} from '../../domain/errors/ScheduleAlreadyRegistered';
import {InvalidDay} from '../../domain/errors/InvalidDay';
import {InvalidHourGap} from '../../domain/errors/InvalidHourGap';
import {ScheduleLimit} from '../../domain/errors/ScheduleLimit';
import {type RegisterTimeSheet} from '../../domain/services/RegisterTimeSheet';
import {type Controller, type Request, type Response} from '../protocols/Controller';
import {ResponseUtils} from '../utils/ResponseUtils';
import {InvalidFormat} from '../../domain/errors/InvalidFormat';
import {type RequestValidator} from '../protocols/RequestValidator';
import {type Logger} from '../protocols/Logger';

type Dependencies = {
	registerTimeSheet: RegisterTimeSheet;
	requestValidator: RequestValidator;
	logger: Logger;
};

export class RegisterTimeSheetController implements Controller {
	constructor(private readonly dependencies: Dependencies) {}

	async handle(request: Request): Promise<Response> {
		try {
			this.dependencies.requestValidator.validate(request);

			const timeRecordInput = new RegisterTimeShetInputDto({
				moment: request.body.momento as string,
			});

			const timeSheet = await this.dependencies.registerTimeSheet.execute(timeRecordInput);
			return ResponseUtils.created(timeSheet.ptBr);
		} catch (error: unknown) {
			if (
				error instanceof InvalidFormat
                || error instanceof InvalidDay
                || error instanceof InvalidHourGap
                || error instanceof ScheduleLimit
			) {
				return ResponseUtils.badRequest(error.ptBr);
			}

			if (error instanceof ScheduleAlreadyRegistered) {
				return ResponseUtils.conflict(error.ptBr);
			}

			const err = error as Error;
			this.dependencies.logger.call(
				'error',
				'RegisterTimeSheetController',
				err.message,
				{stack: err.stack, request},
			);

			return ResponseUtils.internalServerError();
		}
	}
}
