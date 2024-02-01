import {type Logger} from '../presentation/protocols/Logger';

export class LoggerAdapter implements Logger {
	call(level: 'error', context: string, message: string, metadata?: Record<string, any> | undefined): void {
		console[level](`[${context}]: ${message}`, metadata);
	}
}
