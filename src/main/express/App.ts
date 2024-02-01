import express, {type Application, type NextFunction, type Request, type Response} from 'express';
import {Routes} from './Routes';

class App {
	readonly app: Application;

	constructor() {
		this.app = express();
		this.setupMiddlewares();
	}

	private setupMiddlewares() {
		this.app.use(express.json());
		this.app.use((_request: Request, response: Response, next: NextFunction): void => {
			response.type('json');
			next();
		});
		Routes.register(this.app);
	}
}

export const {app} = new App();
