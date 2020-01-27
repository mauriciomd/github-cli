import { GluegunToolbox } from 'gluegun';
import * as keytar from 'keytar';
import api from '../services/api';

interface GithubResponse {
    clone_url: string;
}

async function execute(toolbox: GluegunToolbox) {
    const { print, filesystem, system } = toolbox;
    const { first } = toolbox.parameters;

    if (!first) {
        print.error('How to use: github-cli project:link <folder-name>')
        return;
    }

    const absolutePath = `${filesystem.cwd()}${filesystem.separator}${first}`;
    if (!filesystem.isDirectory(absolutePath)) {
        print.error(`Folder ${first} does not exists`);
        return;
    }

    const userToken = await keytar.findPassword('github');
    if (!userToken) {
        print.error('User not found! Please, register a user using auth:token')
        return;
    }
    
    const response = await api.post<GithubResponse>('/user/repos', {
        name: first,
    }, {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });

    if (response.status !== 201) {
        print.error('Error on creating the repository');
        return;
    }
    const projectPath = filesystem.dir(absolutePath).cwd();
    const repositoryUrl = response.data.clone_url;

    process.chdir(projectPath);
    print.info( await system.run('git init'));
    print.info('Adding remote git server...');
    print.info( await system.run(`git remote add origin ${repositoryUrl}`));
    
    print.success('Done!');
}


module.exports = {
    name:'project:link',
    description: 'Create a new project on Github.com and link with the local folder',
    run: execute,
};