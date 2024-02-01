export abstract class Entity {
	protected convertFieldsToSnakeCase(object: Record<string, any>): Record<string, any> {
		return Object.keys(object)
			.map(key => ({
				[key.replace(/([A-Z])/g, match => `_${match.toLowerCase()}`)]: object[key] as unknown,
			}))
			.reduce((acc, cur) => ({...acc, ...cur}), {});
	}
}
