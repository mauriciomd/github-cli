import { GluegunToolbox } from 'gluegun';
import * as keytar from 'keytar';
import api from '../services/api';

interface GithubResponse {
    clone_url: string;
}

async function execute(toolbox: GluegunToolbox) {
    const { print, filesystem } = toolbox;
    const { first } = toolbox.parameters;

    if (!first) {
        print.error('How to use: github-cli project:remove <project-name>')
        return;
    }

    const credentials = await keytar.findCredentials('github');
    if (credentials.length === 0) {
        print.error('User not found! Please, register a user using auth:token');
        return;
    } else if (credentials.length > 1) {
        print.error('Error: There is more than one user with the same credentials');
        return;
    }

    const absolutePath = `${filesystem.cwd()}${filesystem.separator}${first}`;
    if (filesystem.exists(absolutePath).valueOf() === 'dir') {
        filesystem.remove(absolutePath);
        print.success('Local folder removed successfully');
    }
    
    print.info('Removing repository from github');
    const { account, password } = credentials[0];
    

    
    const response = await api.delete<GithubResponse>(`/repos/${account}/${first}`, {
        name: first,
    }, {
        headers: {
            Authorization: `Bearer ${password}`
        }
    });

    print.error(response);

    if (response.status !== 204) {
        print.error('Error on removing the repository');
        return;
    }
    
    print.success('Done!');
}

module.exports = {
    name: 'project:remove',
    description: 'Delete a project localy and remotely', 
    run: execute,
};