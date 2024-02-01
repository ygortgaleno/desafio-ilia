import {GetMonthReportInputDto} from '../../domain/dtos/GetMonthReportInputDto';
import {InvalidFormat} from '../../domain/errors/InvalidFormat';
import {ReportNotFound} from '../../domain/errors/ReportNotFound';
import {type GetMonthReport} from '../../domain/services/GetMonthReport';
import {type Controller, type Request, type Response} from '../protocols/Controller';
import {type Logger} from '../protocols/Logger';
import {type RequestValidator} from '../protocols/RequestValidator';
import {ResponseUtils} from '../utils/ResponseUtils';

type Dependecies = {
	getMonthReport: GetMonthReport;
	validateRequestParams: RequestValidator;
	logger: Logger;
};

export class GetMonthReportController implements Controller {
	constructor(private readonly dependencies: Dependecies) {}

	async handle(request: Request): Promise<Response> {
		try {
			this.dependencies.validateRequestParams.validate(request);

			const monthReport = await this.dependencies.getMonthReport.execute(new GetMonthReportInputDto({
				monthYear: request.params.monthYear as string,
			}));

			return ResponseUtils.success(monthReport.ptBr);
		} catch (error: unknown) {
			if (error instanceof ReportNotFound) {
				return ResponseUtils.notFoundError(error.ptBr);
			}

			if (error instanceof InvalidFormat) {
				return ResponseUtils.badRequest(error.ptBr);
			}

			const err = error as Error;
			this.dependencies.logger.call(
				'error',
				'GetMonthReportController',
				err.message,
				{stack: err.stack, request},
			);

			return ResponseUtils.internalServerError();
		}
	}
}
