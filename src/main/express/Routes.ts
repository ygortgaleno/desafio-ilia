import {type Application, Router} from 'express';
import {ExpressControllerAdapter} from '../adapters/ExpressControllerAdapter';
import {RegisterTimeSheetControllerFactory} from '../factories/controllers/RegisterTimeSheetControllerFactory';
import {GetMonthReportControllerFactory} from '../factories/controllers/GetMonthReportControllerFactory';

export class Routes {
	static register(app: Application) {
		// eslint-disable-next-line new-cap
		const router = Router();
		app.use('/v1', router);
		router.post('/batidas', Routes.controllers.registerTimeRecordController);
		router.get('/folhas-de-ponto/:monthYear', Routes.controllers.getMonthReportController);
		app.use(router);
	}

	private static get controllers() {
		return {
			registerTimeRecordController: ExpressControllerAdapter.adapt(
				RegisterTimeSheetControllerFactory.create(),
			),
			getMonthReportController: ExpressControllerAdapter.adapt(
				GetMonthReportControllerFactory.create(),
			),
		};
	}
}
