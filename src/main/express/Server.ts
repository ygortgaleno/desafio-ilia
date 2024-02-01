import {loggerAdapter} from '../factories/singleton/LoggerAdapterFactory';
import {app} from './App';
(async () => {
	const port = process.env.SERVICE_PORT ?? 3000;
	app.listen(port, () => {
		loggerAdapter.call('info', 'server.ts', `Server runing at http://localhost:${port}`);
	});
})();
