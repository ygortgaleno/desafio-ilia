/* eslint-disable @typescript-eslint/naming-convention */
import {RegisterTimeShetInputDto} from '../../../src/domain/dtos/RegisterTimeSheetInputDto';
import {RegisterTimeSheetOutputDto} from '../../../src/domain/dtos/RegisterTimeSheetOutputDto';
import {TimeSheetDatabaseDto} from '../../../src/domain/dtos/TimeSheetDatabaseDto';
import {InvalidDay} from '../../../src/domain/errors/InvalidDay';
import {InvalidHourGap} from '../../../src/domain/errors/InvalidHourGap';
import {ScheduleAlreadyRegistered} from '../../../src/domain/errors/ScheduleAlreadyRegistered';
import {ScheduleLimit} from '../../../src/domain/errors/ScheduleLimit';
import {RegisterTimeSheet} from '../../../src/domain/services/RegisterTimeSheet';
import {HoursManagerAdapter} from '../../../src/domain/utils/HoursManagerAdapter';
import {TimeSheetRepositoryMock} from '../../mocks/TimeSheetRepository.mock';

// Sut = suite under test
const makeSut = () => {
	const timeSheetRepository = new TimeSheetRepositoryMock(); // Database mock
	const hoursManager = new HoursManagerAdapter();
	const sut = new RegisterTimeSheet({
		hoursManager,
		timeSheetRepository, // Database mock
	});

	return {sut, manipulateHours: hoursManager, timeSheetRepository};
};

describe('RegisterTimeSheet', () => {
	const {sut, manipulateHours, timeSheetRepository} = makeSut();

	beforeAll(() => {
		jest.spyOn(manipulateHours, 'diffBetweenHours');
		jest.spyOn(manipulateHours, 'sumHours');
		jest.spyOn(timeSheetRepository, 'create');
		jest.spyOn(timeSheetRepository, 'find');
		jest.spyOn(timeSheetRepository, 'list');
		jest.spyOn(timeSheetRepository, 'update');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('on success', () => {
		describe('when is the first record registered for current date', () => {
			beforeAll(() => {
				jest.spyOn(timeSheetRepository, 'find').mockResolvedValueOnce(undefined);
			});

			it('should create time sheet', async () => {
				const registerTimeSheetInputDto = new RegisterTimeShetInputDto({
					moment: '2024-01-02T08:00:00',
				});
				const registerTimeSheetOutptDto = await sut.execute(registerTimeSheetInputDto);

				expect(registerTimeSheetOutptDto).toBeInstanceOf(RegisterTimeSheetOutputDto);
				expect(registerTimeSheetOutptDto.date).toBe('2024-01-02');
				expect(registerTimeSheetOutptDto.hours).toEqual(['08:00:00']);
				expect(timeSheetRepository.find).toHaveBeenCalledWith({date: '2024-01-02'});
				expect(timeSheetRepository.create).toHaveBeenCalledWith({
					date: '2024-01-02',
					hours: ['08:00:00'],
					workedHours: '00:00:00',
				});
				expect(timeSheetRepository.list).not.toHaveBeenCalled();
				expect(timeSheetRepository.update).not.toHaveBeenCalled();
				expect(manipulateHours.sumHours).not.toHaveBeenCalled();
				expect(manipulateHours.diffBetweenHours).not.toHaveBeenCalled();
			});
		});

		describe('when is the second record registered for current date', () => {
			beforeAll(() => {
				jest.spyOn(timeSheetRepository, 'find').mockResolvedValueOnce(new TimeSheetDatabaseDto({
					id: 1,
					date: '2024-01-02',
					hours: ['08:00:00'],
					worked_hours: '00:00:00',
				}));
			});

			it('should create time sheet', async () => {
				const registerTimeSheetInputDto = new RegisterTimeShetInputDto({
					moment: '2024-01-02T12:00:00',
				});
				const registerTimeSheetOutptDto = await sut.execute(registerTimeSheetInputDto);

				expect(registerTimeSheetOutptDto).toBeInstanceOf(RegisterTimeSheetOutputDto);
				expect(registerTimeSheetOutptDto.date).toBe('2024-01-02');
				expect(registerTimeSheetOutptDto.hours).toEqual(['08:00:00', '12:00:00']);
				expect(timeSheetRepository.find).toHaveBeenCalledWith({date: '2024-01-02'});
				expect(timeSheetRepository.update).toHaveBeenCalledWith(1, {
					date: '2024-01-02',
					hours: ['08:00:00', '12:00:00'],
					workedHours: '04:00:00',
				});
				expect(manipulateHours.diffBetweenHours).toHaveBeenNthCalledWith(
					1, '08:00:00', '12:00:00',
				);
				expect(manipulateHours.diffBetweenHours).toHaveBeenNthCalledWith(
					2, '08:00:00', '12:00:00',
				);
				expect(timeSheetRepository.create).not.toHaveBeenCalled();
				expect(timeSheetRepository.list).not.toHaveBeenCalled();
				expect(manipulateHours.sumHours).not.toHaveBeenCalled();
			});
		});

		describe('when is the fourth record registered for current date', () => {
			beforeAll(() => {
				jest.spyOn(timeSheetRepository, 'find').mockResolvedValueOnce(new TimeSheetDatabaseDto({
					id: 1,
					date: '2024-01-02',
					hours: ['08:00:00', '12:00:00', '14:00:00'],
					worked_hours: '04:00:00',
				}));
			});

			it('should create time sheet', async () => {
				const registerTimeSheetInputDto = new RegisterTimeShetInputDto({
					moment: '2024-01-02T18:00:00',
				});
				const registerTimeSheetOutptDto = await sut.execute(registerTimeSheetInputDto);

				expect(registerTimeSheetOutptDto).toBeInstanceOf(RegisterTimeSheetOutputDto);
				expect(registerTimeSheetOutptDto.date).toBe('2024-01-02');
				expect(registerTimeSheetOutptDto.hours).toEqual(
					['08:00:00', '12:00:00', '14:00:00', '18:00:00'],
				);
				expect(timeSheetRepository.find).toHaveBeenCalledWith({date: '2024-01-02'});
				expect(timeSheetRepository.update).toHaveBeenCalledWith(1, {
					date: '2024-01-02',
					hours: ['08:00:00', '12:00:00', '14:00:00', '18:00:00'],
					workedHours: '08:00:00',
				});
				expect(manipulateHours.diffBetweenHours).toHaveBeenNthCalledWith(
					1, '08:00:00', '12:00:00',
				);
				expect(manipulateHours.diffBetweenHours).toHaveBeenNthCalledWith(
					2, '14:00:00', '18:00:00',
				);
				expect(manipulateHours.sumHours).toHaveBeenCalledWith('04:00:00', '04:00:00');
				expect(timeSheetRepository.create).not.toHaveBeenCalled();
				expect(timeSheetRepository.list).not.toHaveBeenCalled();
			});
		});
	});

	describe('on error', () => {
		describe('when is invalid day(saturday or sunday)', () => {
			it('should throw invalid day error', async () => {
				const registerTimeSheetInputDto = new RegisterTimeShetInputDto({
					moment: '2024-01-07T08:00:00',
				});

				await expect(sut.execute(registerTimeSheetInputDto)).rejects.toThrow(InvalidDay);
				expect(timeSheetRepository.find).not.toHaveBeenCalled();
				expect(timeSheetRepository.create).not.toHaveBeenCalled();
				expect(timeSheetRepository.list).not.toHaveBeenCalled();
				expect(timeSheetRepository.update).not.toHaveBeenCalled();
				expect(manipulateHours.sumHours).not.toHaveBeenCalled();
				expect(manipulateHours.diffBetweenHours).not.toHaveBeenCalled();
			});
		});

		describe('when already has four time record registered', () => {
			beforeAll(() => {
				jest.spyOn(timeSheetRepository, 'find').mockResolvedValueOnce(new TimeSheetDatabaseDto({
					id: 1,
					date: '2024-01-02',
					hours: ['08:00:00', '12:00:00', '14:00:00', '18:00:00'],
					worked_hours: '08:00:00',
				}));
			});

			it('should throw schedule limit error', async () => {
				const registerTimeSheetInputDto = new RegisterTimeShetInputDto({
					moment: '2024-01-02T08:00:00',
				});

				await expect(sut.execute(registerTimeSheetInputDto)).rejects.toThrow(ScheduleLimit);
				expect(timeSheetRepository.find).toHaveBeenCalledWith({date: '2024-01-02'});
				expect(timeSheetRepository.create).not.toHaveBeenCalled();
				expect(timeSheetRepository.list).not.toHaveBeenCalled();
				expect(timeSheetRepository.update).not.toHaveBeenCalled();
				expect(manipulateHours.sumHours).not.toHaveBeenCalled();
				expect(manipulateHours.diffBetweenHours).not.toHaveBeenCalled();
			});
		});

		describe('when time record already registered', () => {
			beforeAll(() => {
				jest.spyOn(timeSheetRepository, 'find').mockResolvedValueOnce(new TimeSheetDatabaseDto({
					id: 1,
					date: '2024-01-02',
					hours: ['08:00:00'],
					worked_hours: '08:00:00',
				}));
			});

			it('should throw schedule already registered error', async () => {
				const registerTimeSheetInputDto = new RegisterTimeShetInputDto({
					moment: '2024-01-02T08:00:00',
				});

				await expect(sut.execute(registerTimeSheetInputDto)).rejects.toThrow(ScheduleAlreadyRegistered);
				expect(timeSheetRepository.find).toHaveBeenCalledWith({date: '2024-01-02'});
				expect(timeSheetRepository.create).not.toHaveBeenCalled();
				expect(timeSheetRepository.list).not.toHaveBeenCalled();
				expect(timeSheetRepository.update).not.toHaveBeenCalled();
				expect(manipulateHours.sumHours).not.toHaveBeenCalled();
				expect(manipulateHours.diffBetweenHours).not.toHaveBeenCalled();
			});
		});

		describe('when there is a gap of five hours or more from the last record', () => {
			beforeAll(() => {
				jest.spyOn(timeSheetRepository, 'find').mockResolvedValueOnce(new TimeSheetDatabaseDto({
					id: 1,
					date: '2024-01-02',
					hours: ['08:00:00'],
					worked_hours: '08:00:00',
				}));
			});

			it('should throw invalid hour gap error', async () => {
				const registerTimeSheetInputDto = new RegisterTimeShetInputDto({
					moment: '2024-01-02T13:00:00',
				});

				await expect(sut.execute(registerTimeSheetInputDto)).rejects.toThrow(InvalidHourGap);
				expect(timeSheetRepository.find).toHaveBeenCalledWith({date: '2024-01-02'});
				expect(manipulateHours.diffBetweenHours).toHaveBeenCalledWith('08:00:00', '13:00:00');
				expect(timeSheetRepository.create).not.toHaveBeenCalled();
				expect(timeSheetRepository.list).not.toHaveBeenCalled();
				expect(timeSheetRepository.update).not.toHaveBeenCalled();
				expect(manipulateHours.sumHours).not.toHaveBeenCalled();
			});
		});
	});
});
