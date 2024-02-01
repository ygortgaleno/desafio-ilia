export type Service<T, K> = {
	execute(payload: T): Promise<K>;
};
