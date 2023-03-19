import { color } from '@oclif/color';
import { Command, Flags } from '@oclif/core';
import { Authentication, Database, Manager, Scaffolding, SQLiteGitIgnore, Stack, Type } from '../onboard';
import { existsSync } from 'fs';
import { ISettings, IOnboarding } from '../interface';
import { basename, join } from 'path';
import { Scaffold } from '../utils/scaffold';
import { welcome } from '../utils/welcome';
import { waitForState } from '../utils/waitForState';
import { isDirEmpty } from '../utils/isDirEmpty';
import { dim } from '../utils/dim';
import { Language } from '../onboard/Language';
var inquirer = require('inquirer');

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
		scaffolding: Flags.string({ description: 'The default scaffolding to use', options: ['mpa', 'spa'] }),
		database: Flags.string({ description: 'The default database driver to use', options: ['MySQL / MariaDB', 'PostgreSQL / Amazon Redshift', 'SQLite', 'MSSQL', 'Oracle', 'skip'] }),
		'sqlite-git-ignore': Flags.boolean({ description: 'Add SQLite Database to gitignore', char: 'G' }),
		manager: Flags.string({ description: 'The default package manager to use', options: ['npm', 'yarn'] }),
		language: Flags.string({ description: 'The default language to use', options: ['imba', 'typescript'] }),
		dev: Flags.boolean({ description: 'Use dev branch' }),
		imba: Flags.boolean({ description: 'Create Imba Full-Stack application' }),
		react: Flags.boolean({ description: 'Create React Full-Stack TypeScript application' }),
		vue: Flags.boolean({ description: 'Create Vue Full-Stack TypeScript application' }),
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
		language: null
	};

	/**
	 * Execute command
	 *
	 * @returns {Promise<void>}
	 */
	public async run(): Promise<void> {
		const { args, flags } = await this.parse(New);

		welcome('FormidableJs');

		if (/[^a-z0-9-_]/gi.test(args.name) && !['.', './'].includes(args.name)) {
			return this.error(`${color.red('Invalid Application name.')}`);
		}

		this.settings.application = join(process.cwd(), !['.', './'].includes(args.name) ? args.name : '');

		if ((existsSync(this.settings.application) && !['.', './'].includes(args.name)) || ['.', './'].includes(args.name) && !isDirEmpty(this.settings.application)) {
			return this.error(color.red('Application already exists!'));
		}

		if (['.', './'].includes(args.name)) {
			args.name = basename(this.settings.application);
		}

		const stacks = [];

		if (flags.imba) {
			stacks.push('Imba');
		}

		if (flags.react) {
			stacks.push('React');
		}

		if (flags.vue) {
			stacks.push('Vue');
		}

		if (stacks.length > 1) {
			return this.error(color.red(`Cannot scaffolding ${stacks.join(', ').replace(/, ([^,]*)$/, ' and $1')} in the same application`));
		}

		if (flags.imba || flags.react || flags.vue) {
			flags.language = flags.imba ? 'imba' : 'typescript';

			if (flags.react) {
				flags.stack = 'react';
			} else if (flags.vue) {
				flags.stack = 'vue';
			} else if (flags.imba) {
				flags.stack = 'imba';
				flags.scaffolding = 'spa';
			}

			if (!flags.database) {
				flags.database = 'skip';
				flags['sqlite-git-ignore'] = true;
			}

			if (!flags.manager) {
				flags.manager = 'npm';
			}
		}

		/** initiate scaffolding */
		if (flags.language) this.onboarding.language = flags.language;

		if (!this.onboarding.language) {
			({ language: this.onboarding.language } = await Language.make());
		} else {
			this.log(color.green('! ') + dim(`Using ${this.onboarding.language == 'typescript' ? 'TypeScript' : 'Imba'} as the default Language`));
		}

		const scaffold = new Scaffold(args.name, this.settings.application, this, flags.dev, this.onboarding.language === 'typescript');

		/** scaffold application. */
		await scaffold.make();

		/** start the onboarding. */
		if (flags.type) this.onboarding.type = flags.type;

		/** if user has specified scaffolding and set it to "spa", set the application type to "full-stack". */
		if (flags.scaffolding) {
			this.onboarding.scaffolding = flags.scaffolding;

			this.onboarding.stack = 'imba';
			this.onboarding.type = 'full-stack';
		}

		/** if user has specified stack, set the application type to "full-stack". */
		if (flags.stack) {
			this.onboarding.stack = flags.stack;
			this.onboarding.type = 'full-stack';
		}

		/** if user has skipped or set database to sqlite, git ignore database. */
		if (flags.database) {
			this.onboarding.database = Database.getDriver(flags.database);

			if (['skip', 'SQLite'].includes(flags.database)) {
				this.onboarding.sqliteGitIgnore = true;
			}
		}

		if (flags['sqlite-git-ignore']) this.onboarding.sqliteGitIgnore = flags['sqlite-git-ignore'];
		if (flags.manager) this.onboarding.manager = flags.manager;

		if (!this.onboarding.type) {
			({ type: this.onboarding.type } = await Type.make());
		} else {
			this.log(color.green('! ') + dim(`Creating ${this.onboarding.type === 'api' ? 'an API' : 'a full-stack'} ${this.onboarding.language === 'imba' ? 'Imba' : 'TypeScript'} application`));
		}

		if (!this.onboarding.stack && this.onboarding.type === 'full-stack') {
			({ stack: this.onboarding.stack } = await Stack.make());
		} else {
			if (this.onboarding.type === 'full-stack') {
				this.log(color.green('! ') + dim(`Using ${this.onboarding.stack} as default stack`));
			}
		}

		if (!this.onboarding.scaffolding && this.onboarding.stack === 'imba' && this.onboarding.type === 'full-stack') {
			({ scaffolding: this.onboarding.scaffolding } = await Scaffolding.make());
		} else {
			if (this.onboarding.stack === 'imba' && this.onboarding.type === 'full-stack') {
				this.log(color.green('! ') + dim(`Using ${this.onboarding.scaffolding} as default scaffolding`));
			}
		}

		if (!this.onboarding.database) {
			({ database: this.onboarding.database } = await Database.make());
		} else {
			if (this.onboarding.database !== 'skip') {
				this.log(color.green('! ') + dim(`Using ${this.onboarding.database} as default database`));
			}
		}

		if (!this.onboarding.sqliteGitIgnore && this.onboarding.database?.toLocaleLowerCase() === 'sqlite3') {
			({ sqliteGitIgnore: this.onboarding.sqliteGitIgnore } = await SQLiteGitIgnore.make());
		} else {
			this.onboarding.sqliteGitIgnore = true;
		}

		if (!this.onboarding.manager) {
			({ manager: this.onboarding.manager } = await Manager.make());
		} else {
			this.log(color.green('! ') + dim(`Using ${this.onboarding.manager} as the default package manager`));
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
			.apiUpdates()
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

		if (this.onboarding.scaffolding && this.onboarding.stack === 'imba') {
			const { authentication } = await Authentication.make()

			console.log('')

			if (authentication) {
				await scaffold.enableAuth(this.onboarding.scaffolding)
			}

			console.log('')
		}

		const space = '   ';

		this.log(color.green(`${flags.git ? '\n' : ''}Your application is ready! 🎉\n`));
		this.log(color.cyan('Get started with the following commands:'));

		if (process.cwd() !== this.settings.application) {
			this.log(dim(`${space}cd ${args.name}`));
		}

		if (this.onboarding.type === 'full-stack' && ['react', 'vue'].includes(this.onboarding.stack?.toLowerCase() ?? '')) {
			if (this.onboarding.manager == 'pnpm') {
				this.log(dim(`${space}${this.onboarding.manager} install webpack --save-dev`));
			} else {
				this.log(dim(`${space}${this.onboarding.manager} ${this.onboarding.manager != 'yarn' ? 'install' : ''}`));
			}

			this.log(dim(`${space}${this.onboarding.manager} ${this.onboarding.manager != 'pnpm' ? 'run ' : ''}mix:dev`));
		}

		this.log(dim(`${space}${this.onboarding.manager} audit`));
		this.log(dim(`${space}${this.onboarding.manager} start${this.onboarding.manager == 'npm' ? ' --':''} --dev`));
	}
}
