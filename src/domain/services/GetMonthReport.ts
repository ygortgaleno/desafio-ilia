
import crypto from 'crypto';
import {type GetMonthReportInputDto} from '../dtos/GetMonthReportInputDto';
import {GetMonthReportOutputDto} from '../dtos/GetMonthReportOutputDto';
import {type TimeSheetDatabaseDto} from '../dtos/TimeSheetDatabaseDto';
import {MonthReport} from '../entities/MonthReport';
import {ReportNotFound} from '../errors/ReportNotFound';
import {type HoursManager} from '../protocols/HoursManager';
import {type MonthReportRepository} from '../protocols/MonthReportRepository';
import {type Service} from '../protocols/Service';
import {type TimeSheetRepository} from '../protocols/TimeSheetRepository';
import {MonthReportDatabaseDto} from '../dtos/MonthReportDatabaseDto';

type Dependencies = {
	manipulateHours: HoursManager;
	monthReportRepository: MonthReportRepository;
	timeSheetRepository: TimeSheetRepository;
};

export class GetMonthReport implements Service<GetMonthReportInputDto, GetMonthReportOutputDto> {
	constructor(private readonly dependecies: Dependencies) {}

	async execute(payload: GetMonthReportInputDto): Promise<GetMonthReportOutputDto> {
		const timeSheetsDto = await this.getTimeSheets(payload.monthYear);
		const timeSheetsHash = crypto.createHash('sha256').update(JSON.stringify(timeSheetsDto)).digest('hex');

		const monthReportDto = await this.dependecies.monthReportRepository.find({monthYear: payload.monthYear});
		if (monthReportDto && monthReportDto.hash === timeSheetsHash) {
			const {id: _, month_year: monthYear, overtime_hours: overtimeHours, owed_hours: owedHours, worked_hours: workedHours} = monthReportDto;
			return new GetMonthReportOutputDto({
				monthYear,
				overtimeHours,
				owedHours,
				workedHours,
				bussinessHours: timeSheetsDto,
			});
		}

		const workedHoursMonth = this.calcWorkedHours(timeSheetsDto);
		const overtimeHours = this.calcOvertimeHours(workedHoursMonth);
		const owedHours = this.calcOwedHours(workedHoursMonth);

		const monthReport = new MonthReport({
			monthYear: payload.monthYear,
			workedHours: workedHoursMonth,
			hash: timeSheetsHash,
			overtimeHours,
			owedHours,
		});

		if (monthReportDto && monthReportDto.hash !== timeSheetsHash) {
			// Update month report if month report exists but hashes are differents
			await this.dependecies.monthReportRepository.update(monthReportDto.id, monthReport);
		} else {
			await this.dependecies.monthReportRepository.create(monthReport);
		}

		return new GetMonthReportOutputDto({
			...monthReport,
			bussinessHours: timeSheetsDto,
		});
	}

	private async getTimeSheets(monthYear: string): Promise<TimeSheetDatabaseDto[]> {
		const timeSheetsDto = await this.dependecies.timeSheetRepository.list({monthYear});
		if (!timeSheetsDto.length) {
			throw new ReportNotFound();
		}

		return timeSheetsDto;
	}

	private calcWorkedHours(timeSheetsDto: TimeSheetDatabaseDto[]): string {
		return timeSheetsDto
			.map(t => t.worked_hours)
			.reduce(
				(acc, cur) => this.dependecies.manipulateHours.sumHours(acc, cur),
				'00:00:00',
			);
	}

	private calcOvertimeHours(workedHoursMonth: string): string {
		if (Number(workedHoursMonth.split(':')[0]) >= 176) {
			return this.dependecies.manipulateHours.diffBetweenHours('176:00:00', workedHoursMonth);
		}

		return '00:00:00';
	}

	private calcOwedHours(workedHoursMonth: string): string {
		if (Number(workedHoursMonth.split(':')[0]) < 176) {
			return this.dependecies.manipulateHours.diffBetweenHours(workedHoursMonth, '176:00:00');
		}

		return '00:00:00';
	}
}
