import {app} from './App';
(async () => {
	const port = process.env.SERVICE_PORT ?? 3000;
	app.listen(port, () => {
		console.log(`Server runing at http://localhost:${port}`);
	});
})();
