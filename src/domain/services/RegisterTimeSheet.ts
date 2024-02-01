import {type RegisterTimeShetInputDto} from '../dtos/RegisterTimeSheetInputDto';
import {RegisterTimeSheetOutputDto} from '../dtos/RegisterTimeSheetOutputDto';
import {type TimeSheetDatabaseDto} from '../dtos/TimeSheetDatabaseDto';
import {TimeSheet} from '../entities/TimeSheet';
import {ScheduleAlreadyRegistered} from '../errors/ScheduleAlreadyRegistered';
import {InvalidDay} from '../errors/InvalidDay';
import {InvalidHourGap} from '../errors/InvalidHourGap';
import {ScheduleLimit} from '../errors/ScheduleLimit';
import {type HoursManager} from '../protocols/HoursManager';
import {type Service} from '../protocols/Service';
import {type TimeSheetRepository} from '../protocols/TimeSheetRepository';

type Dependencies = {
	timeSheetRepository: TimeSheetRepository;
	hoursManager: HoursManager;
};

export class RegisterTimeSheet implements Service<RegisterTimeShetInputDto, RegisterTimeSheetOutputDto> {
	constructor(private readonly dependencies: Dependencies) {}

	async execute(payload: RegisterTimeShetInputDto): Promise<RegisterTimeSheetOutputDto> {
		const [date, hour] = payload.moment.split('T');
		this.verifyIfIsValidDay(date);

		const timeSheet = await this.getTimeSheetFromDate(date);
		if (timeSheet) {
			this.verifyIfHasFourSchedulesAlreadyRegisterd(timeSheet);
			return this.updateExistingTimeSheet(timeSheet, hour);
		}

		const newTimeSheetDto = await this.dependencies.timeSheetRepository.create(new TimeSheet({
			date,
			hours: [hour],
			workedHours: '00:00:00',
		}));

		return new RegisterTimeSheetOutputDto({
			date: newTimeSheetDto.date,
			hours: newTimeSheetDto.hours,
		});
	}

	private verifyIfIsValidDay(date: string) {
		const day = new Date(date).getDay();
		const fridayNumber = 4;
		const mondayNumber = 1;

		if (day > fridayNumber || day < mondayNumber) {
			throw new InvalidDay();
		}
	}

	private async getTimeSheetFromDate(date: string): Promise<TimeSheetDatabaseDto | undefined> {
		const timeSheet = await this.dependencies.timeSheetRepository.find({date});
		return timeSheet;
	}

	private verifyIfHasFourSchedulesAlreadyRegisterd(timeSheet: TimeSheetDatabaseDto) {
		const schedulesLimit = 4;
		if (timeSheet.hours.length >= schedulesLimit) {
			throw new ScheduleLimit();
		}
	}

	private async updateExistingTimeSheet(timeSheetDto: TimeSheetDatabaseDto, hour: string): Promise<RegisterTimeSheetOutputDto> {
		this.verifyIfTimeRecordAlreadyRegistered(timeSheetDto, hour);
		if (timeSheetDto.hours.length === 1) {
			this.verifyIfNewTimeRecordHasMoreThanFourHoursOfLastRecord(timeSheetDto, hour);
		}

		const timeSheet = new TimeSheet({
			date: timeSheetDto.date,
			hours: [...timeSheetDto.hours, hour].sort(),
			workedHours: timeSheetDto.worked_hours,
		});
		timeSheet.workedHours = this.calcWorkedHours(timeSheet.hours);

		await this.dependencies.timeSheetRepository.update(timeSheetDto.id, timeSheet);

		return new RegisterTimeSheetOutputDto({date: timeSheet.date, hours: timeSheet.hours});
	}

	private calcWorkedHours(hours: string[]): string {
		let workedHours = '00:00:00';
		if (hours.length > 1) {
			workedHours = this.dependencies.hoursManager.diffBetweenHours(
				hours[0], hours[1],
			);

			if (hours.length === 4) {
				workedHours = this.dependencies.hoursManager.sumHours(
					this.dependencies.hoursManager.diffBetweenHours(
						hours[2], hours[3],
					),
					workedHours,
				);
			}
		}

		return workedHours;
	}

	private verifyIfTimeRecordAlreadyRegistered(timeSheet: TimeSheetDatabaseDto, hour: string) {
		const timeRecord = timeSheet.hours.filter(h => h === hour);

		if (timeRecord.length) {
			throw new ScheduleAlreadyRegistered();
		}
	}

	private verifyIfNewTimeRecordHasMoreThanFourHoursOfLastRecord(
		timeRecord: TimeSheetDatabaseDto, hour: string,
	) {
		const fiveHours = 5;
		const lastHourRecord = timeRecord.hours[0];
		const diffHours = Number(
			this.dependencies.hoursManager.diffBetweenHours(
				lastHourRecord, hour,
			).split(':')[0],
		);
		if (diffHours >= fiveHours) {
			throw new InvalidHourGap();
		}
	}
}
