import {type Controller, type Request} from '../../presentation/protocols/Controller';
import {type Request as ExpressRequest, type Response as ExpressResponse, NextFunction as ExpressNextFunction} from 'express';

export class ExpressControllerAdapter {
	static adapt(controller: Controller) {
		return async (req: ExpressRequest, res: ExpressResponse) => {
			const request: Request = {
				body: req.body as unknown,
				params: req.params,
			};

			const response = await controller.handle(request);
			return res.status(response.statusCode).json(response.body);
		};
	}
}
