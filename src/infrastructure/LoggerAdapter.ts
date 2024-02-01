import pino, {type Logger as LoggerPino} from 'pino';
import {type Logger} from '../presentation/protocols/Logger';

export class LoggerAdapter implements Logger {
	private readonly logger: LoggerPino;

	constructor() {
		this.logger = pino({
			enabled: process.env.NODE_ENV !== 'test',
		});
	}

	call(level: 'error' | 'info', context: string, message: string, metadata?: Record<string, any> | undefined): void {
		this.logger.child(metadata ?? {})[level](`[${context}]: ${message}`);
	}
}
