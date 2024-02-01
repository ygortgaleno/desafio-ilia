export type Logger = {
	call(level: 'error' | 'info', context: string, message: string, metadata?: Record<string, any>): void;
};
