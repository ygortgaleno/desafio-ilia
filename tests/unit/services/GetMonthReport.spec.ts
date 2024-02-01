/* eslint-disable max-nested-callbacks */
import {GetMonthReportInputDto} from '../../../src/domain/dtos/GetMonthReportInputDto';
import {GetMonthReportOutputDto} from '../../../src/domain/dtos/GetMonthReportOutputDto';
import {TimeSheetDatabaseDto} from '../../../src/domain/dtos/TimeSheetDatabaseDto';
import {ReportNotFound} from '../../../src/domain/errors/ReportNotFound';
import {GetMonthReport} from '../../../src/domain/services/GetMonthReport';
import {HoursManagerAdapter} from '../../../src/domain/utils/HoursManagerAdapter';
import {MonthRepositoryMock} from '../../mocks/MonthRepository.mock';
import {TimeSheetRepositoryMock} from '../../mocks/TimeSheetRepository.mock';
import {createHash, type Hash} from 'crypto';

jest.mock('crypto', () => ({
	createHash: jest.fn(),
}));

// Sut = suite under test
const makeSut = () => {
	const monthReportRepository = new MonthRepositoryMock(); // Database mock
	const timeSheetRepository = new TimeSheetRepositoryMock(); // Database mock
	const manipulateHours = new HoursManagerAdapter();
	const sut = new GetMonthReport({
		manipulateHours,
		monthReportRepository, // Database mock
		timeSheetRepository, // Database mock
	});

	return {sut, manipulateHours, monthReportRepository, timeSheetRepository};
};

describe('GetMonthReport', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('on success', () => {
		const {sut, monthReportRepository, timeSheetRepository, manipulateHours} = makeSut();

		beforeAll(() => {
			(createHash as jest.MockedFunction<typeof createHash>).mockReturnValue({
				update: jest.fn().mockReturnThis(),
				digest: jest.fn().mockReturnValue('test'),
			} as unknown as Hash);
			jest.spyOn(monthReportRepository, 'create');
			jest.spyOn(monthReportRepository, 'find');
			jest.spyOn(monthReportRepository, 'update');
			jest.spyOn(timeSheetRepository, 'create');
			jest.spyOn(timeSheetRepository, 'find');
			jest.spyOn(timeSheetRepository, 'list');
			jest.spyOn(timeSheetRepository, 'update');
			jest.spyOn(manipulateHours, 'diffBetweenHours');
			jest.spyOn(manipulateHours, 'sumHours');
		});

		describe('when month report already exists', () => {
			describe('and hash are equal', () => {
				it('should return month report', async () => {
					const getMonthReportInputDto = new GetMonthReportInputDto({
						monthYear: '2024-01',
					});
					const result = await sut.execute(getMonthReportInputDto);

					expect(result).toBeInstanceOf(GetMonthReportOutputDto);
					expect(result.bussinessHours).toBeTruthy();
					expect(result.monthYear).toBeTruthy();
					expect(result.overtimeHours).toBeTruthy();
					expect(result.owedHours).toBeTruthy();
					expect(result.workedHours).toBeTruthy();
					expect(timeSheetRepository.list).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
					expect(monthReportRepository.find).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
					expect(monthReportRepository.update).not.toHaveBeenCalled();
					expect(timeSheetRepository.create).not.toHaveBeenCalled();
					expect(timeSheetRepository.find).not.toHaveBeenCalled();
					expect(timeSheetRepository.update).not.toHaveBeenCalled();
					expect(monthReportRepository.create).not.toHaveBeenCalled();
					expect(manipulateHours.sumHours).not.toHaveBeenCalled();
					expect(manipulateHours.diffBetweenHours).not.toHaveBeenCalled();
				});
			});

			describe('and hash are differents', () => {
				beforeAll(() => {
					(createHash as jest.MockedFunction<typeof createHash>).mockReturnValueOnce({
						update: jest.fn().mockReturnThis(),
						digest: jest.fn().mockReturnValue('test2'),
					} as unknown as Hash);
				});

				it('should update month report', async () => {
					const getMonthReportInputDto = new GetMonthReportInputDto({
						monthYear: '2024-01',
					});
					const result = await sut.execute(getMonthReportInputDto);

					expect(result).toBeInstanceOf(GetMonthReportOutputDto);
					expect(result.bussinessHours).toBeTruthy();
					expect(result.monthYear).toBeTruthy();
					expect(result.overtimeHours).toBeTruthy();
					expect(result.owedHours).toBeTruthy();
					expect(result.workedHours).toBeTruthy();
					expect(timeSheetRepository.list).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
					expect(monthReportRepository.find).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
					expect(monthReportRepository.update).toHaveBeenCalledWith(1, {
						hash: 'test2',
						monthYear: '2024-01',
						overtimeHours: '00:00:00',
						owedHours: '168:00:00',
						workedHours: '08:00:00',
					});
					expect(manipulateHours.sumHours).toHaveBeenCalledWith('00:00:00', '08:00:00');
					expect(manipulateHours.diffBetweenHours).toHaveBeenCalledWith('08:00:00', '176:00:00');
					expect(timeSheetRepository.create).not.toHaveBeenCalled();
					expect(timeSheetRepository.find).not.toHaveBeenCalled();
					expect(timeSheetRepository.update).not.toHaveBeenCalled();
					expect(monthReportRepository.create).not.toHaveBeenCalled();
				});
			});
		});

		describe('when month report not exists', () => {
			describe('and doesnt have overtime hours', () => {
				beforeAll(() => {
					jest.spyOn(monthReportRepository, 'find').mockResolvedValueOnce(undefined);
				});

				it('should create and return month report', async () => {
					const getMonthReportInputDto = new GetMonthReportInputDto({
						monthYear: '2024-01',
					});
					const result = await sut.execute(getMonthReportInputDto);

					expect(result).toBeInstanceOf(GetMonthReportOutputDto);
					expect(result.bussinessHours).toBeTruthy();
					expect(result.monthYear).toBeTruthy();
					expect(result.overtimeHours).toBeTruthy();
					expect(result.owedHours).toBeTruthy();
					expect(result.workedHours).toBeTruthy();
					expect(timeSheetRepository.list).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
					expect(monthReportRepository.find).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
					expect(monthReportRepository.create).toHaveBeenCalledWith({
						monthYear: '2024-01',
						overtimeHours: '00:00:00',
						owedHours: '168:00:00',
						workedHours: '08:00:00',
						hash: 'test',
					});
					expect(manipulateHours.sumHours).toHaveBeenCalledWith('00:00:00', '08:00:00');
					expect(manipulateHours.diffBetweenHours).toHaveBeenCalledWith('08:00:00', '176:00:00');
					expect(monthReportRepository.update).not.toHaveBeenCalled();
					expect(timeSheetRepository.create).not.toHaveBeenCalled();
					expect(timeSheetRepository.find).not.toHaveBeenCalled();
					expect(timeSheetRepository.update).not.toHaveBeenCalled();
				});
			});

			describe('and has overtime hours', () => {
				beforeAll(() => {
					jest.spyOn(monthReportRepository, 'find').mockResolvedValueOnce(undefined);
					jest.spyOn(timeSheetRepository, 'list').mockResolvedValueOnce(new Array(22).fill(
						new TimeSheetDatabaseDto({
							id: 1,
							date: '2024-01-01',
							hours: ['08:00:00', '12:30:00', '13:00:00', '18:00:00'],
							// eslint-disable-next-line @typescript-eslint/naming-convention
							worked_hours: '08:30:00',
						}),
					));
				});

				it('should create and return month report', async () => {
					const getMonthReportInputDto = new GetMonthReportInputDto({
						monthYear: '2024-01',
					});
					const result = await sut.execute(getMonthReportInputDto);

					expect(result).toBeInstanceOf(GetMonthReportOutputDto);
					expect(result.bussinessHours).toBeTruthy();
					expect(result.monthYear).toBeTruthy();
					expect(result.overtimeHours).toBeTruthy();
					expect(result.owedHours).toBeTruthy();
					expect(result.workedHours).toBeTruthy();
					expect(timeSheetRepository.list).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
					expect(monthReportRepository.find).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
					expect(monthReportRepository.create).toHaveBeenCalledWith({
						monthYear: '2024-01',
						overtimeHours: '11:00:00',
						owedHours: '00:00:00',
						workedHours: '187:00:00',
						hash: 'test',
					});
					expect(manipulateHours.sumHours).toHaveBeenCalledTimes(22);
					expect(manipulateHours.diffBetweenHours).toHaveBeenCalledWith('176:00:00', '187:00:00');
					expect(monthReportRepository.update).not.toHaveBeenCalled();
					expect(timeSheetRepository.create).not.toHaveBeenCalled();
					expect(timeSheetRepository.find).not.toHaveBeenCalled();
					expect(timeSheetRepository.update).not.toHaveBeenCalled();
				});
			});
		});
	});

	describe('on error', () => {
		const {sut, monthReportRepository, timeSheetRepository, manipulateHours} = makeSut();

		beforeAll(() => {
			jest.spyOn(monthReportRepository, 'create');
			jest.spyOn(monthReportRepository, 'find');
			jest.spyOn(monthReportRepository, 'update');
			jest.spyOn(timeSheetRepository, 'create');
			jest.spyOn(timeSheetRepository, 'find');
			jest.spyOn(timeSheetRepository, 'list');
			jest.spyOn(timeSheetRepository, 'update');
			jest.spyOn(manipulateHours, 'diffBetweenHours');
			jest.spyOn(manipulateHours, 'sumHours');
		});

		describe('when dont have any timesheet for current month', () => {
			beforeAll(() => {
				jest.spyOn(monthReportRepository, 'find').mockResolvedValueOnce(undefined);
				jest.spyOn(timeSheetRepository, 'list').mockResolvedValueOnce([]);
			});

			it('should throw report not found error', async () => {
				const getMonthReportInputDto = new GetMonthReportInputDto({
					monthYear: '2024-01',
				});

				await expect(sut.execute(getMonthReportInputDto)).rejects.toThrow(ReportNotFound);
				expect(timeSheetRepository.list).toHaveBeenCalledWith({monthYear: getMonthReportInputDto.monthYear});
				expect(monthReportRepository.find).not.toHaveBeenCalled();
				expect(monthReportRepository.update).not.toHaveBeenCalled();
				expect(timeSheetRepository.create).not.toHaveBeenCalled();
				expect(timeSheetRepository.find).not.toHaveBeenCalled();
				expect(timeSheetRepository.update).not.toHaveBeenCalled();
				expect(monthReportRepository.create).not.toHaveBeenCalled();
				expect(manipulateHours.sumHours).not.toHaveBeenCalled();
				expect(manipulateHours.diffBetweenHours).not.toHaveBeenCalled();
			});
		});
	});
});
