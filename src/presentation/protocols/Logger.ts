export type Logger = {
	call(level: 'error', context: string, message: string, metadata?: Record<string, any>): void;
};
