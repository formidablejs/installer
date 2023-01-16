import { AuthEmailModifier } from '../modifier/AuthEmailModifier';
import { AuthMailPublishable } from '../publishable/AuthMailPublishable';
import { ClientUrlModifier } from '../modifier/ClientUrlModifier';
import { copyFileSync, createWriteStream, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { Database } from '../onboard';
import { download } from "./download";
import { execSync } from 'child_process';
import { getDefaultBranch } from './getDefaultBranch';
import { InertiaConfigModifier } from '../modifier/InertiaConfigModifier';
import { InertiaPublishable } from '../publishable/InertiaPublishable';
import { InertiaResolverModifier } from '../modifier/InertiaResolverModifier';
import { join } from 'path';
import { MailPublishable } from '../publishable/MailPublishable';
import { PrettyErrorsModifier } from '../modifier/PrettyErrorsModifier';
import { ReactHook } from '../hooks/ReactHook';
import { SessionModifier } from '../modifier/SessionModifier';
import { SPAPublishable } from '../publishable/SPAPublishable';
import { tmpdir } from 'os';
import { updateLine } from './updateLine';
import { VueHook } from '../hooks/VueHook';
import { WebPublishable } from '../publishable/WebPublishable';
import { ViewResolverModifier } from '../modifier/ViewResolverModifier';
import New from '../commands/new';
import { removeSync } from 'fs-extra';
import { AuthResolverModifier } from '../modifier/AuthResolverModifier';
const unzipper = require('unzipper');

export class Scaffold {
	/**
	 * Scaffolding state.
	 *
	 * @var {boolean} success
	 */
	private success: boolean = false;

	/**
	 * Scaffolding busy.
	 *
	 * @var {boolean} busy
	 */
	private busy: boolean = false;

	/**
	 * Formidable skeleton.
	 *
	 * @var {string} url
	 */
	protected url: string = 'https://github.com/formidablejs/formidablejs/archive/refs/heads/{branch}.zip';

	/**
	 * Formidable skeleton destination.
	 *
	 * @var {string} skeleton
	 */
	protected skeleton: string = join(tmpdir(), 'formidablejs-skeleton.zip');

	/**
	 * Use TypeScript.
	 *
	 * @var {Boolean} ts
	 */
	protected ts: Boolean = false;

	/**
	 * Scaffold application.
	 *
	 * @param {string} appName application name
	 * @param {string} output Output directory
	 * @param {New} command
	 * @param {Boolean} dev
	 * @returns {void}
	 */
	constructor(protected appName: string, protected output: string, protected command: New, dev: Boolean = false, ts: Boolean = false) {
		if (ts) {
			this.url = 'https://github.com/formidablejs/formidablejs-typescript/archive/refs/heads/{branch}.zip';
		}

		if (dev) {
			this.url = `https://github.com/formidablejs/${ts ? 'formidablejs-typescript' : 'formidablejs'}/archive/refs/heads/dev.zip`;
		}

		this.ts = ts;
	}

	/**
	 * Check if scaffold was successful.
	 *
	 * @returns {boolean}
	 */
	public get isSuccessful(): Boolean {
		return this.success;
	}

	/**
	 * Check if application is still scaffolding.
	 *
	 * @returns {boolean}
	 */
	public get isBusy(): Boolean {
		return this.busy;
	}

	/**
	 * Make application.
	 *
	 * @returns {void}
	 */
	public async make() {
		this.busy = true;

		let url = this.url;

		/** fetch default branch name if installer is not using the --dev flag. */
		if (url.indexOf('{branch}') !== -1) {
			const branch = await getDefaultBranch('main', this.ts);

			url = url.replace('{branch}', branch);
		}

		download(url, this.skeleton)
			.then(async (response) => {
				this.busy = false;

				if (response !== true) return this.success = false;

				const directory = await unzipper.Open.file(this.skeleton);

				Object.values(directory.files).forEach((entry: any) => {
					const dir = entry.path.split('/');

					dir.shift();

					const entryPath = join(this.output, dir.join('/'));

					if (entry.type === 'Directory') {
						mkdirSync(entryPath, { recursive: true });
					} else {
						if (entry.path.split('/').pop() !== 'package-lock.json') {
							entry.stream()
								.pipe(createWriteStream(entryPath))
								.on('error', (error: any) => {
									this.command.error('Could not create Formidablejs application');

									this.command.exit(1);
								});
						}
					}
				});

				this.success = true;
			})
	}

	/**
	 * Run installer.
	 *
	 * @returns {Scaffold}
	 */
	public install() {
		this.command.log(`\n⚡ Installation will begin shortly. This might take a while ☕\n`);

		/** create env. */
		this.createEnv();

		/** collection dependencies. */
		const deps = this.getDependencies();

		const flags = this.command.onboarding.manager == 'npm'
			? '--no-audit --progress=false'
			: '--no-audit --no-progress'

		/** install dependencies. */
		execSync(
			`${this.command.onboarding.manager ?? 'npm'} ${deps.length > 0 && this.command.onboarding.manager === 'yarn' ? 'add' : 'install'} ${deps.join(' ')} ${this.command.onboarding.manager == 'pnpm' ? '' : '--legacy-peer-deps'} ${flags}`,
			{ cwd: this.output, stdio: 'inherit' }
		);

		/** copy inertia files to application. */
		if (
			this.command.onboarding.type === 'full-stack'
			&& this.command.onboarding.stack
		) {
			if (this.command.onboarding.stack.toLowerCase() === 'react') {
				ReactHook.make(this.output);
			}

			if (this.command.onboarding.stack.toLowerCase() === 'vue') {
				VueHook.make(this.output);
			}
		}

		return this;
	}

	/**
	 * Create env variable file.
	 *
	 * @returns {void}
	 */
	private createEnv() {
		copyFileSync(join(this.output, '.env.example'), join(this.output, '.env'));
	}

	/**
	 * Get dependencies to install.
	 *
	 * @return {string[]}
	 */
	private getDependencies(): string[] {
		let deps: string[] = [];

		if (this.command.onboarding.type === 'full-stack') {
			deps.push('@formidablejs/pretty-errors');

			if (this.command.onboarding.stack?.toLowerCase() === 'imba' && (this.command.onboarding.scaffolding === 'spa' || this.command.onboarding.scaffolding === 'spa-auth')) {
				deps.push('@formidablejs/view');
				deps.push('axios');
			}

			if (this.command.onboarding.stack && ['react', 'vue'].includes(this.command.onboarding.stack)) {
				deps.push('@formidablejs/inertia');
			}
		}

		if (this.command.onboarding.database) {
			deps.push(Database.resolveDependency(this.command.onboarding.database));
		}

		if (this.command.onboarding.manager === 'pnpm') {
			deps.push('pluralize');
		}

		return deps;
	}

	/**
	 * Publish dependencies.
	 *
	 * @returns {Scaffold}
	 */
	public publish(): Scaffold {
		this.command.log(' ');

		AuthMailPublishable.make(this.output);
		MailPublishable.make(this.output);

		if (this.command.onboarding.type === 'full-stack') {
			if (this.command.onboarding.scaffolding === 'mpa' || this.command.onboarding.scaffolding === 'mpa-auth') {
				const tags = []

				if (this.command.onboarding.scaffolding === 'mpa-auth') {
					tags.push('auth')
				}

				WebPublishable.make(this.output, tags);
			} else if (this.command.onboarding.scaffolding === 'spa' || this.command.onboarding.scaffolding === 'spa-auth') {
				const tags = []

				if (this.command.onboarding.scaffolding === 'spa-auth') {
					tags.push('auth', 'auth-common')
				}

				SPAPublishable.make(this.output, tags);

				if (this.command.onboarding.scaffolding === 'spa-auth') {
					removeSync(join(this.output, 'resources', 'frontend', 'components'))
					unlinkSync(join(this.output, 'resources', 'frontend', 'pages', 'About.imba'))
					unlinkSync(join(this.output, 'resources', 'frontend', 'pages', 'Home.imba'))
				}
			} else if (this.command.onboarding.stack && ['react', 'vue'].includes(this.command.onboarding.stack)) {
				WebPublishable.make(this.output);
				InertiaPublishable.make(this.output);
			}
		}

		return this;
	}

	/**
	 * Modify application.
	 *
	 * @returns {Scaffold}
	 */
	public modify(): Scaffold {
		if (this.command.onboarding.type === 'full-stack') {
			PrettyErrorsModifier.make(this.output, this.ts);
			SessionModifier.make(this.output, this.ts);

			if (['react', 'vue'].includes(this.command.onboarding.stack ?? '')) {
				InertiaResolverModifier.make(this.output, this.ts);
				InertiaConfigModifier.make(this.output, this.ts);
			}

			if (this.command.onboarding.scaffolding?.toLowerCase() === 'mpa-auth') {
				AuthResolverModifier.make(this.output, this.ts)
			}

			if (this.command.onboarding.stack?.toLowerCase() === 'imba' && (this.command.onboarding.scaffolding === 'spa' || this.command.onboarding.scaffolding === 'spa-auth')) {
				ViewResolverModifier.make(this.output, this.ts)
			}
		}

		if (this.command.onboarding.type === 'api') {
			ClientUrlModifier.make(this.output, this.ts);
		}

		return this;
	}

	/**
	 * Uncomment auth mailers.
	 *
	 * @returns {Scaffold}
	 */
	public enableAuthMailers(): Scaffold {
		AuthEmailModifier.make(this.output, this.ts);

		return this;
	}

	/**
	 * Generate encryption key.
	 *
	 * @returns {Scaffold}
	 */
	public generateKey(): Scaffold {
		this.command.log(' ');

		const generate = execSync(`node craftsman key:generate`, {
			cwd: this.output,
		}).toString();

		this.command.log(generate.replace(/\r?\n|\r/g, ''));

		return this;
	}

	/**
	 * Set package name.
	 *
	 * @returns {Scaffold}
	 */
	public setPackageName(): Scaffold {
		const packageName = join(this.output, 'package.json');

		const packageObject: any = JSON.parse(readFileSync(packageName).toString());

		packageObject.name = this.appName.replace(new RegExp(' ', 'g'), '-');

		writeFileSync(packageName, JSON.stringify(packageObject, null, 2));

		return this;
	}

	/**
	 * Set application database.
	 *
	 * @returns {Scaffold}
	 */
	public setDatabase(): Scaffold {
		let connection: string = '';

		switch (this.command.onboarding.database) {
			case 'mysql':
				connection = 'mysql';
				break;

			case 'pg':
				connection = 'pgsql';
				break;

			case 'sqlite3':
				connection = 'sqlite';
				break;

			case 'tedious':
				connection = 'mssql';
				break;

			case 'oracledb':
				connection = 'oracle';
				break;

			default:
				connection = 'sqlite'
		}

		updateLine(join(this.output, '.env'), (line: string) => {
			if (line.startsWith('DB_CONNECTION')) line = `DB_CONNECTION=${connection}`;

			if (connection === 'sqlite') {
				if (line.startsWith('DB_CONNECTION')) {
					line = `${line}\nDATABASE_URL=database/db.sqlite`;
				}

				if (line.startsWith('DB_') && !line.startsWith('DB_CONNECTION')) {
					line = `# ${line}`;
				}

				/** create sqlite file. */
				writeFileSync(join(this.output, 'database/db.sqlite'), '');
			}

			return line;
		});

		if (connection === 'sqlite') {
			updateLine(join(this.output, 'config', `database.${this.ts ? 'ts' : 'imba'}`), (line: string) => {
				if (line.trim() == `useNullAsDefault: null${this.ts ? ',' : ''}`) {
					line = `\tuseNullAsDefault: true${this.ts ? ',' : ''}`;
				}

				return line;
			});

			if (this.command.onboarding.sqliteGitIgnore === true) {
				updateLine(join(this.output, '.gitignore'), (line: string) => {
					if (line.trim() === '/bootstrap/cache/config.json') {
						line = `${line}\n/database/db.sqlite`;
					}

					return line;
				});
			}
		}

		return this;
	}

	/**
	 * Update configs for api applications.
	 *
	 * @returns {Scaffold}
	 */
	public apiUpdates(): Scaffold {
		if (this.command.onboarding.type != 'api') {
			return this;
		}

		updateLine(join(this.output, 'config', `app.${this.ts ? 'ts' : 'imba'}`), (line: string) => {
			if ([
				`CookieServiceResolver${this.ts ? ',' : ''}`,
				`SessionMemoryStoreServiceResolver${this.ts ? ',' : ''}`,
				`SessionFileStoreServiceResolver${this.ts ? ',' : ''}`,
				`SessionServiceResolver${this.ts ? ',' : ''}`,
				`CsrfServiceResolver${this.ts ? ',' : ''}`
			].includes(line.trim())) {
				line = `		${this.ts ? '//' : '#'} ${line.trim()}`;
			}

			return line;
		});

		return this;
	}

	/**
	 * Cache application.
	 *
	 * @returns {Scaffold}
	 */
	public cache(): Scaffold {
		execSync('node craftsman config:cache', {
			cwd: this.output, stdio: 'inherit'
		})

		return this;
	}

	/**
	 * Add .npmrc file.
	 *
	 * @returns {Scaffold}
	 */
	public npmrc(): Scaffold {
		writeFileSync(join(this.output, '.npmrc'), "auto-install-peers=true\nstrict-peer-dependencies=false\n");

		return this;
	}

	/**
	 * Initialize git.
	 *
	 * @returns {Scaffold}
	 */
	public git(): Scaffold {
		execSync('git init --initial-branch=main', {
			cwd: this.output, stdio: 'inherit'
		});

		return this;
	}
}
