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
import { sleep } from '../utils/sleep';
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
		'silent-install': Flags.boolean({ description: 'Install silently', char: 'q' }),
		'sqlite-git-ignore': Flags.boolean({ description: 'Add SQLite Database to gitignore', char: 'G' }),
		'use-pnpm': Flags.boolean({ description: 'Use pnpm instead of npm or yarn', char: 'p' }),
        'use-npm': Flags.boolean({ description: 'Use npm instead of pnpm or yarn', char: 'n' }),
        'use-yarn': Flags.boolean({ description: 'Use yarn instead of pnpm or npm', char: 'y' }),
		database: Flags.string({ description: 'The default database driver to use', char: 'd', options: ['MySQL', 'PostgreSQL', 'SQLite', 'MSSQL', 'Oracle', 'skip'] }),
		dev: Flags.boolean({ description: 'Use dev branch' }),
		git: Flags.boolean({ description: 'Initialize a Git repository', char: 'g' }),
		imba: Flags.boolean({ description: 'Create Imba Full-Stack application' }),
		language: Flags.string({ description: 'The default language to use', char: 'l', options: ['imba', 'typescript'] }),
		manager: Flags.string({ description: 'The default package manager to use', char: 'm', options: ['npm', 'pnpm', 'yarn'] }),
		react: Flags.boolean({ description: 'Create React Full-Stack application' }),
		scaffolding: Flags.string({ description: 'The default scaffolding to use', char: 'S', options: ['mpa', 'spa'] }),
		stack: Flags.string({ description: 'The default stack to use', char: 's', options: ['imba', 'react', 'svelte', 'vue'] }),
		svelte: Flags.boolean({ description: 'Create Svelte Full-Stack application' }),
		type: Flags.string({ description: 'The type of application to create', char: 't', options: ['api', 'full-stack'] }),
		vue: Flags.boolean({ description: 'Create Vue Full-Stack application' }),
		verbose: Flags.boolean({ description: 'Verbose output' }),
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
		silentInstall: null,
		manager: null,
		language: null
	};

	/**
	 * Verbose output
	 *
	 * @var {boolean}
	 */
	public verbose: boolean = false;

	/**
	 * Execute command
	 *
	 * @returns {Promise<void>}
	 */
	public async run(): Promise<void> {
		const { args, flags } = await this.parse(New);

		this.verbose = flags.verbose;

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

		if (!flags.manager) {
			const managers = [];

			if (flags['use-pnpm']) {
				managers.push('pnpm');
			}

			if (flags['use-npm']) {
				managers.push('npm');
			}

			if (flags['use-yarn']) {
				managers.push('yarn');
			}

			if (managers.length > 1) {
				return this.error(color.red(`Cannot use ${managers.join(', ').replace(/, ([^,]*)$/, ' and $1')} in the same application`));
			}

			if (managers.length === 1) {
				flags.manager = managers[0];
			}
		}

		const stacks = [];

		if (flags.imba) {
			stacks.push('Imba');
		}

		if (flags.react) {
			stacks.push('React');
		}

		if (flags.svelte) {
			stacks.push('Svelte');
		}

		if (flags.vue) {
			stacks.push('Vue');
		}

		if (stacks.length > 1) {
			return this.error(color.red(`Cannot scaffolding ${stacks.join(', ').replace(/, ([^,]*)$/, ' and $1')} in the same application`));
		}

		if (flags.imba || flags.react || flags.svelte || flags.vue) {
			if (!flags.language) {
				flags.language = flags.imba ? 'imba' : 'typescript';
			}

			if (flags.react) {
				flags.stack = 'react';
			} else if (flags.vue) {
				flags.stack = 'vue';
			} else if (flags.svelte) {
				flags.stack = 'svelte';
			} else if (flags.imba) {
				flags.stack = 'imba';

				if (!flags.scaffolding) {
					flags.scaffolding = 'spa';
				}
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
		if (!this.onboarding.language) {
			if (flags.language) {
				this.onboarding.language = flags.language;
			} else {
				this.onboarding.language = 'typescript';
			}
		}

		if (flags['silent-install']) {
			this.onboarding.silentInstall = true;
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

			await sleep(5000)
		}

		if (!scaffold.isSuccessful) {
			this.log(color.red('Scaffolding failed. It could be your network connection. Please try again.'));
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
			.enableAuthMailers()
			.build();

		/** enable type safety for typescript applications. */
		if (this.onboarding.language === 'typescript') {
			scaffold.enableTypeSafety();
		}

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

		if (this.onboarding.type === 'full-stack' && ['react', 'svelte', 'vue'].includes(this.onboarding.stack?.toLowerCase() ?? '')) {
			this.log(dim(`${space}${this.onboarding.manager} install ${this.onboarding.manager == 'pnpm' ? 'webpack --save-dev' : ''}`));
		}

		if (flags['silent-install']) {
			this.log(dim(`${space}${this.onboarding.manager} audit`));
		}

		this.log(dim(`${space}node craftsman serve --dev`));
	}
}
