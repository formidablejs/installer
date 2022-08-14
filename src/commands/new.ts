import { color } from '@oclif/color';
import { Command, Flags } from '@oclif/core';
import { Database, Manager, Scaffolding, SQLiteGitIgnore, Stack, Type } from '../onboard';
import { existsSync } from 'fs';
import { ISettings, IOnboarding } from '../interface';
import { basename, join } from 'path';
import { Scaffold } from '../utils/scaffold';
import { welcome } from '../utils/welcome';
import { waitForState } from '../utils/waitForState';
import { isDirEmpty } from '../utils/isDirEmpty';
import { dim } from '../utils/dim';

export default class New extends Command {
	/**
	 * Command description
	 *
	 * @var {string}
	 */
	static description = 'Create a new Formidable application';

	/**
	 * Command example
	 *
	 * @var {string[]}
	 */
	static examples = [
		'<%= config.bin %> <%= command.id %> my-app --type api',
	];

	/**
	 * Command flags
	 *
	 * @var {object}
	 */
	static flags = {
		git: Flags.boolean({ description: 'Initialize a Git repository', char: 'g' }),
		type: Flags.string({ description: 'The type of application to create', options: ['api', 'full-stack'] }),
		stack: Flags.string({ description: 'The default stack to use', options: ['imba', 'react', 'vue'] }),
		scaffolding: Flags.string({ description: 'The default scaffolding to use', options: ['blank', 'spa'] }),
		database: Flags.string({ description: 'The default database driver to use', options: ['MySQL / MariaDB', 'PostgreSQL / Amazon Redshift', 'SQLite', 'MSSQL', 'Oracle', 'skip'] }),
		'sqlite-git-ignore': Flags.boolean({ description: 'Add SQLite Database to gitignore', char: 'G' }),
		manager: Flags.string({ description: 'The default package manager to use', options: ['npm', 'yarn', 'pnpm'] }),
		dev: Flags.boolean({ description: 'Use dev branch' }),
		ts: Flags.boolean({ description: 'Use TypeScript' }),
	};

	/**
	 * Command arguments
	 *
	 * @var {object[]}
	 */
	static args = [
		{
			name: 'name',
			required: true,
			description: 'Application name',
		}
	];

	/**
	 * Project settings.
	 *
	 * @var {ISettings}
	 */
	private settings: ISettings = {
		application: null,
	};

	/**
	 * Onboarding data
	 *
	 * @var {IOnboarding}
	 */
	public onboarding: IOnboarding = {
		type: null,
		stack: null,
		scaffolding: null,
		database: null,
		sqliteGitIgnore: null,
		manager: null,
	};

	/**
	 * Execute command
	 * @returns {Promise<void>}
	 */
	public async run(): Promise<void> {
		const { args, flags } = await this.parse(New);

		welcome('Formidable');

		if (/[^a-z0-9-_]/gi.test(args.name) && args.name !== '.') {
			return this.error(`${color.red('Invalid Application name.')}`);
		}

		this.settings.application = join(process.cwd(), args.name !== '.' ? args.name : '');

		if ((existsSync(this.settings.application) && args.name !== '.') || args.name === '.' && !isDirEmpty(this.settings.application)) {
			return this.error(color.red('Application already exists!'));
		}

		if (args.name === '.') {
			args.name = basename(this.settings.application);
		}

		const scaffold = new Scaffold(args.name, this.settings.application, this, flags.dev, flags.ts);

		/** scaffold application. */
		await scaffold.make();

		/** start the onboarding. */
		if (flags.type) this.onboarding.type = flags.type;
		if (flags.stack) this.onboarding.stack = flags.stack;
		if (flags.scaffolding) this.onboarding.scaffolding = flags.scaffolding;
		if (flags.database) this.onboarding.database = Database.getDriver(flags.database);
		if (flags['sqlite-git-ignore']) this.onboarding.sqliteGitIgnore = flags['sqlite-git-ignore'];
		if (flags.manager) this.onboarding.manager = flags.manager;

		if (!this.onboarding.type) {
			({ type: this.onboarding.type } = await Type.make());
		} else {
			this.log(dim(`Creating ${this.onboarding.type === 'api' ? 'an API' : 'a full-stack'} application`));
		}

		if (!this.onboarding.database) {
			({ database: this.onboarding.database } = await Database.make());
		} else {
			if (this.onboarding.database !== 'skip') {
				this.log(dim(`Using ${this.onboarding.database} as default database`));
			}
		}

		if (!this.onboarding.sqliteGitIgnore && this.onboarding.database?.toLocaleLowerCase() === 'sqlite3') {
			({ sqliteGitIgnore: this.onboarding.sqliteGitIgnore } = await SQLiteGitIgnore.make());
		} else {
			this.onboarding.sqliteGitIgnore = true;
		}

		if (!this.onboarding.stack && this.onboarding.type === 'full-stack') {
			({ stack: this.onboarding.stack } = await Stack.make());
		} else {
			if (this.onboarding.type === 'full-stack') {
				this.log(dim(`Using ${this.onboarding.stack} as default stack`));
			}
		}

		if (!this.onboarding.scaffolding && this.onboarding.stack === 'imba' && this.onboarding.type === 'full-stack') {
			({ scaffolding: this.onboarding.scaffolding } = await Scaffolding.make());
		} else {
			if (this.onboarding.stack === 'imba' && this.onboarding.type === 'full-stack') {
				this.log(dim(`Using ${this.onboarding.scaffolding} as default scaffolding`));
			}
		}

		if (!this.onboarding.manager) {
			({ manager: this.onboarding.manager } = await Manager.make());
		} else {
			this.log(dim(`Using ${this.onboarding.manager} as the default package manager`));
		}
		/** end the onboarding. */

		/** wait for the scaffolding to finish. */
		if (scaffold.isBusy) {
			await waitForState(() => !scaffold.isBusy);
		}

		if (!scaffold.isSuccessful) {
			this.log(color.red('Scaffolding failed. It could be your network connection.'));
			this.exit(1);
		}

		scaffold
			.install()
			.publish()
			.modify()
			.generateKey()
			.setPackageName()
			.setDatabase()
			.cache()
			.enableAuthMailers();

		/** add npmrc file. */
		if (this.onboarding.manager == 'pnpm') {
			scaffold.npmrc();
		}

		/** initialize git. */
		if (flags.git) {
			scaffold.git();
		}

		this.log(color.green('\n✅ Your application is ready!'));
		this.log(color.green('👉 Get started with the following commands:\n'));

		if (process.cwd() !== this.settings.application) {
			this.log(dim(`$ cd ${args.name}`));
		}

		if (this.onboarding.type === 'full-stack' && ['react', 'vue'].includes(this.onboarding.stack?.toLowerCase() ?? '')) {
			if (this.onboarding.manager == 'pnpm') {
				this.log(dim(`$ ${this.onboarding.manager} install webpack --save-dev`));
			} else {
				this.log(dim(`$ ${this.onboarding.manager} ${this.onboarding.manager != 'yarn' ? 'install' : ''}`));
			}

			this.log(dim(`$ ${this.onboarding.manager} ${this.onboarding.manager != 'pnpm' ? 'run ' : ''}mix:dev`));
		}

		this.log(dim(`$ ${this.onboarding.manager} start`));
	}
}
