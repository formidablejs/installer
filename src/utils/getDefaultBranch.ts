import axios from "axios"

export const getDefaultBranch = async (defaultBranch: string = 'main', ts: Boolean = false) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/formidablejs/${ts ? 'formidablejs-typescript' : 'formidablejs'}`);

        return response.data.default_branch;
    } catch {
        /** return default branch if an error occures. */
        return defaultBranch;
    }
};
