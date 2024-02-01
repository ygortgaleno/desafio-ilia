import {type OutputDto} from '../protocols/OutputDto';
import {type TimeSheetDatabaseDto} from './TimeSheetDatabaseDto';

export class GetMonthReportOutputDto implements OutputDto {
	monthYear: string;
	workedHours: string;
	overtimeHours: string;
	owedHours: string;
	bussinessHours: TimeSheetDatabaseDto[];

	constructor(payload: Omit<GetMonthReportOutputDto, 'ptBr'>) {
		this.monthYear = payload.monthYear;
		this.workedHours = payload.workedHours;
		this.overtimeHours = payload.overtimeHours;
		this.owedHours = payload.owedHours;
		this.bussinessHours = payload.bussinessHours;
	}

	get ptBr(): Record<string, any> {
		return {
			anoMes: this.monthYear,
			horasTrabalhadas: this.workedHours,
			horasExcedentes: this.overtimeHours,
			horasDevidas: this.owedHours,
			expedientes: this.bussinessHours.map(b => ({dia: b.date, pontos: b.worked_hours})),
		};
	}
}
