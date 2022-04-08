import axios from "axios"

export const getDefaultBranch = async (defaultBranch: string = 'main') => {
    try {
        const response = await axios.get('https://api.github.com/repos/formidablejs/formidablejs');
        
        return response.data.default_branch;
    } catch {
        /** return default branch if an error occures. */
        return defaultBranch;
    }
};
