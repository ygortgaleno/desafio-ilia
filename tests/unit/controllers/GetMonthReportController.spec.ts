
import {GetMonthReport} from '../../../src/domain/services/GetMonthReport';
import {HoursManagerAdapter} from '../../../src/domain/utils/HoursManagerAdapter';
import {GetMonthReportController} from '../../../src/presentation/controllers/GetMonthReportController';
import {ValidateGetMonthParameter} from '../../../src/presentation/request_validator/ValidateGetMonthParameter';
import {MonthRepositoryMock} from '../../mocks/MonthRepository.mock';
import {TimeSheetRepositoryMock} from '../../mocks/TimeSheetRepository.mock';
import {ReportNotFound} from '../../../src/domain/errors/ReportNotFound';
import {InvalidFormat} from '../../../src/domain/errors/InvalidFormat';
import {ResponseUtils} from '../../../src/presentation/utils/ResponseUtils';
import {LoggerAdapter} from '../../../src/infrastructure/LoggerAdapter';

// Sut = suit under test
const makeSut = () => {
	const getMonthReport = new GetMonthReport({
		manipulateHours: new HoursManagerAdapter(),
		monthReportRepository: new MonthRepositoryMock(), // Database mock
		timeSheetRepository: new TimeSheetRepositoryMock(), // Database mock
	});
	const sut = new GetMonthReportController({
		getMonthReport,
		validateRequestParams: new ValidateGetMonthParameter(),
		logger: new LoggerAdapter(),
	});

	return {sut, getMonthReport};
};

describe('GetMonthReportController', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('on success', () => {
		const {sut} = makeSut();

		it('should return 201 on status', async () => {
			const result = await sut.handle({
				body: {},
				params: {monthYear: '2024-01'},
			});

			expect(result.statusCode).toBe(200);
			expect(Object.keys(result.body as Record<string, any>).sort()).toEqual(
				['anoMes', 'horasTrabalhadas', 'horasExcedentes', 'horasDevidas', 'expedientes'].sort(),
			);
			expect(result.body.expedientes).toBeInstanceOf(Array);
			expect(
				Object.keys(result.body.expedientes[0] as Record<string, any>).sort(),
			).toEqual(['dia', 'pontos'].sort());
		});
	});

	describe('on failure', () => {
		describe('when report not found', () => {
			const {sut, getMonthReport} = makeSut();
			const reportNotFound = new ReportNotFound();

			beforeAll(() => {
				jest.spyOn(getMonthReport, 'execute').mockRejectedValueOnce(reportNotFound);
			});

			it('should return report not found error', async () => {
				const result = await sut.handle({
					body: {},
					params: {monthYear: '2024-01'},
				});

				expect(result).toEqual(ResponseUtils.notFoundError(reportNotFound.ptBr));
				expect(getMonthReport.execute).toHaveBeenCalled();
			});
		});

		describe('when invalid date format', () => {
			const {sut, getMonthReport} = makeSut();
			const invalidFormat = new InvalidFormat({
				en: 'Date and hour',
				ptBr: 'Data e hora',
			});

			beforeAll(() => {
				jest.spyOn(getMonthReport, 'execute');
			});

			it('should return report not found error', async () => {
				const result = await sut.handle({
					body: {},
					params: {monthYear: '2024-13'},
				});

				expect(result).toEqual(ResponseUtils.badRequest(invalidFormat.ptBr));
				expect(getMonthReport.execute).not.toHaveBeenCalled();
			});
		});

		describe('when is an unhadled error', () => {
			const {sut, getMonthReport} = makeSut();

			beforeAll(() => {
				jest.spyOn(getMonthReport, 'execute').mockRejectedValueOnce(new Error('unhadled error'));
			});

			it('should return report not found error', async () => {
				const result = await sut.handle({
					body: {},
					params: {monthYear: '2024-01'},
				});

				expect(result).toEqual(ResponseUtils.internalServerError());
				expect(getMonthReport.execute).toHaveBeenCalled();
			});
		});
	});
});
