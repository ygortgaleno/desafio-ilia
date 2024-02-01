import knex from 'knex';

class DatabaseConnectionFactory {
	static create() {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const {POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE} = process.env;
		return knex({
			client: 'pg',
			connection: {
				host: POSTGRES_HOST,
				port: 5432,
				user: POSTGRES_USER,
				database: POSTGRES_DATABASE,
				password: POSTGRES_PASSWORD,
			},
			postProcessResponse(result: Array<Record<string, any>> | Record<string, any>) {
				if (Array.isArray(result)) {
					return result.map(
						(row: Record<string, any>) => DatabaseConnectionFactory
							.parseDateFieldOfResultRow(row),
					);
				}

				return DatabaseConnectionFactory.parseDateFieldOfResultRow(result);
			},
		});
	}

	// Work with date as string
	private static parseDateFieldOfResultRow(row: Record<string, any>) {
		for (const prop in row) {
			if (Object.prototype.hasOwnProperty.call(row, prop) && row[prop] instanceof Date) {
				row[prop] = (row[prop] as Date).toISOString();
			}
		}

		return row;
	}
}

export const databaseConnection = DatabaseConnectionFactory.create();
