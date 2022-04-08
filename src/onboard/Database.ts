import { dim } from '../utils/dim';
import { Onboard } from "./Onboard";

export class Database extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: String = 'database';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: String = 'Which database do you want to use?' + dim(' (You can change this later)');

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|Object[]}
	 */
	static choices: Array<String | Object> = [
		{ name: 'MySQL / MariaDB', value: 'mysql' },
		{ name: 'PostgreSQL / Amazon Redshift', value: 'pg' },
		{ name: 'SQLite', value: '@vscode/sqlite3' },
		{ name: 'MSSQL', value: 'tedious' },
		{ name: 'Oracle', value: 'oracledb' },
		{ name: dim('I will set this later'), value: '@vscode/sqlite3' },
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
				return '@vscode/sqlite3';

			case 'mssql':
				return 'tedious';

			case 'oracle':
				return 'oracledb';

			default:
				return '@vscode/sqlite3'
		}
	}
}
