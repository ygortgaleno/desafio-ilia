import {LoggerAdapter} from '../../../infrastructure/LoggerAdapter';

class LoggerAdapterFactory {
	static create() {
		return new LoggerAdapter();
	}
}

export const loggerAdapter = LoggerAdapterFactory.create();
