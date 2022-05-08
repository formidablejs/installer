export interface IPrompt {
    name: String
    message: String
    type: String
    choices?: Array<String | Object>
}