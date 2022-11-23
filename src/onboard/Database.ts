import { dim } from '../utils/dim';
import { Onboard } from "./Onboard";

export class Database extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'database';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string = 'Which database do you want to use?' + dim(' (You can change this later)');

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|Object[]}
	 */
	static choices: Array<string | object> = [
		{ name: 'MySQL / MariaDB', value: 'mysql' },
		{ name: 'PostgreSQL / Amazon Redshift', value: 'pg' },
		{ name: 'SQLite', value: 'sqlite3' },
		{ name: 'MSSQL', value: 'tedious' },
		{ name: 'Oracle', value: 'oracledb' },
		{ name: dim('I will set this later'), value: 'skip' },
	];

	/**
	 * Get database driver.
	 *
	 * @param {string} database
	 * @returns {string}
	 */
	static getDriver(database: string): string {
		switch (database.toLowerCase()) {
			case 'mysql / mariadb':
				return 'mysql';

			case 'postgresql / amazon redshift':
				return 'pg';

			case 'sqlite':
				return 'sqlite3';

			case 'mssql':
				return 'tedious';

			case 'oracle':
				return 'oracledb';

			default:
				return 'sqlite3'
		}
	}

	/**
	 * Get database dependency.
	 *
	 * @param {string} database
	 * @returns {string}
	 */
	static resolveDependency(database: string): string {
		if (database.toLowerCase() === 'skip') {
			return 'sqlite3'
		}

		return database;
	}
}
