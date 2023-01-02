export interface IPrompt {
    name: string
    message: string
    type: string
    choices?: Array<string | object>
    default?: string | number | null
}