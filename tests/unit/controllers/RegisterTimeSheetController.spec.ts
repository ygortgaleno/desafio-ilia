import {RegisterTimeShetInputDto} from '../../../src/domain/dtos/RegisterTimeSheetInputDto';
import {RegisterTimeSheetOutputDto} from '../../../src/domain/dtos/RegisterTimeSheetOutputDto';
import {TimeSheet} from '../../../src/domain/entities/TimeSheet';
import {InvalidDay} from '../../../src/domain/errors/InvalidDay';
import {InvalidFormat} from '../../../src/domain/errors/InvalidFormat';
import {InvalidHourGap} from '../../../src/domain/errors/InvalidHourGap';
import {ScheduleAlreadyRegistered} from '../../../src/domain/errors/ScheduleAlreadyRegistered';
import {ScheduleLimit} from '../../../src/domain/errors/ScheduleLimit';
import {RegisterTimeSheet} from '../../../src/domain/services/RegisterTimeSheet';
import {HoursManagerAdapter} from '../../../src/domain/utils/HoursManagerAdapter';
import {LoggerAdapter} from '../../../src/infrastructure/LoggerAdapter';
import {RegisterTimeSheetController} from '../../../src/presentation/controllers/RegisterTimeSheetController';
import {ValidateRegisterTimeSheetBody} from '../../../src/presentation/request_validator/ValidateRegisterTimeSheetBody';
import {ResponseUtils} from '../../../src/presentation/utils/ResponseUtils';
import {TimeSheetRepositoryMock} from '../../mocks/TimeSheetRepository.mock';

// Sut = suite under test
const makeSut = () => {
	const registerTimeSheet = new RegisterTimeSheet({
		hoursManager: new HoursManagerAdapter(),
		timeSheetRepository: new TimeSheetRepositoryMock(),
	});
	const sut = new RegisterTimeSheetController({
		registerTimeSheet,
		requestValidator: new ValidateRegisterTimeSheetBody(),
		logger: new LoggerAdapter(),
	});

	return {sut, registerTimeSheet};
};

describe('RegisterTimeSheetController', () => {
	describe('on success', () => {
		const {sut, registerTimeSheet} = makeSut();

		beforeAll(() => {
			jest.spyOn(registerTimeSheet, 'execute').mockResolvedValueOnce(new RegisterTimeSheetOutputDto({
				date: '2024-01',
				hours: ['08:00:00'],
			}));
		});

		it('should return 201', async () => {
			const moment = '2024-01-01T08:00:00';
			const result = await sut.handle({
				body: {
					momento: moment,
				},
				params: {},
			});

			expect(result.statusCode).toBe(201);
			expect(Object.keys(result.body as Record<string, any>).sort()).toEqual([
				'dia', 'pontos',
			].sort());
		});
	});

	describe('on failure', () => {
		const {sut, registerTimeSheet} = makeSut();

		describe('when body has invalid format', () => {
			it('should return bad request error', async () => {
				const invalidFormat = new InvalidFormat({
					en: 'Request body',
					ptBr: 'Corpo da requisição',
				});
				const result = await sut.handle({
					body: [],
					params: {},
				});

				expect(result).toEqual(ResponseUtils.badRequest(invalidFormat.ptBr));
			});
		});

		describe('when moment is not provided', () => {
			it('should return bad request error', async () => {
				const invalidFormat = new InvalidFormat({
					en: '\'momento\' field',
					ptBr: 'Campo \'momento\'',
				});
				const result = await sut.handle({
					body: {},
					params: {},
				});

				expect(result).toEqual(ResponseUtils.badRequest(invalidFormat.ptBr));
			});
		});

		describe('when moment has invalid format', () => {
			it('should return bad request error', async () => {
				const invalidFormat = new InvalidFormat({
					en: 'Date and hour',
					ptBr: 'Data e hora',
				});
				const result = await sut.handle({
					body: {
						momento: '2024-14-13',
					},
					params: {},
				});

				expect(result).toEqual(ResponseUtils.badRequest(invalidFormat.ptBr));
			});
		});

		describe('when throws invalid date', () => {
			const invalidDay = new InvalidDay();

			beforeAll(() => {
				jest.spyOn(registerTimeSheet, 'execute').mockRejectedValueOnce(invalidDay);
			});

			it('should return bad request error', async () => {
				const result = await sut.handle({
					body: {
						momento: '2024-01-01T08:00:00',
					},
					params: {},
				});

				expect(result).toEqual(ResponseUtils.badRequest(invalidDay.ptBr));
			});
		});

		describe('when throws invalid hour gap', () => {
			const invalidHourGap = new InvalidHourGap();

			beforeAll(() => {
				jest.spyOn(registerTimeSheet, 'execute').mockRejectedValueOnce(invalidHourGap);
			});

			it('should return bad request error', async () => {
				const result = await sut.handle({
					body: {
						momento: '2024-01-01T08:00:00',
					},
					params: {},
				});

				expect(result).toEqual(ResponseUtils.badRequest(invalidHourGap.ptBr));
			});
		});

		describe('when throws schedule limit', () => {
			const scheduleLimit = new ScheduleLimit();

			beforeAll(() => {
				jest.spyOn(registerTimeSheet, 'execute').mockRejectedValueOnce(scheduleLimit);
			});

			it('should return bad request error', async () => {
				const result = await sut.handle({
					body: {
						momento: '2024-01-01T08:00:00',
					},
					params: {},
				});

				expect(result).toEqual(ResponseUtils.badRequest(scheduleLimit.ptBr));
			});
		});

		describe('when throws schedule already registered', () => {
			const scheduleAlreadyRegistered = new ScheduleAlreadyRegistered();

			beforeAll(() => {
				jest.spyOn(registerTimeSheet, 'execute').mockRejectedValueOnce(scheduleAlreadyRegistered);
			});

			it('should return conflict request error', async () => {
				const result = await sut.handle({
					body: {
						momento: '2024-01-01T08:00:00',
					},
					params: {},
				});

				expect(result).toEqual(ResponseUtils.conflict(scheduleAlreadyRegistered.ptBr));
			});
		});

		describe('when is an unhadled error', () => {
			beforeAll(() => {
				jest.spyOn(registerTimeSheet, 'execute').mockRejectedValueOnce(new Error('unhadled error'));
			});

			it('should return internal server error', async () => {
				const result = await sut.handle({
					body: {
						momento: '2024-01-01T08:00:00',
					},
					params: {},
				});

				expect(result).toEqual(ResponseUtils.internalServerError());
			});
		});
	});
});
