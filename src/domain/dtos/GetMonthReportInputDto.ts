export class GetMonthReportInputDto {
	monthYear: string;

	constructor(payload: Omit<GetMonthReportInputDto, 'ptBr'>) {
		this.monthYear = payload.monthYear;
	}
}
