export class RegisterTimeShetInputDto {
	moment: string;

	constructor(payload: Omit<RegisterTimeShetInputDto, 'ptBr'>) {
		this.moment = payload.moment;
	}
}
