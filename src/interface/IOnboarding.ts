export interface IOnboarding {
	type: string | null
	stack: string | null
	scaffolding: string | null
	database: string | null
	sqliteGitIgnore: boolean | null
	silentInstall: boolean | null
	manager: string | null
	language: 'imba' | 'typescript' | string | null
}
