import { GluegunToolbox } from 'gluegun';
import * as keytar from 'keytar';

interface Auth {
    username: string;
    token: string;
}

function isAuthObject(shouldBeAuth: any): shouldBeAuth is Auth {
    const auth = shouldBeAuth as Auth;
    if (auth.username && auth.token) {
        if (typeof auth.username === 'string' && typeof auth.token === 'string') {
            return true;
        }
    }

    return false;
}

async function execute(toolbox: GluegunToolbox) {
    const { print } = toolbox;
    const { options } = toolbox.parameters;
    
    if (!isAuthObject(options)) {
        print.info('github-cli auth:add --username <user> --token <access-token>');
        return;
    }

    await keytar.setPassword('github', options.username, options.token);
    print.success('Done!');
}


module.exports = {
    name: 'auth:add',
    description: 'Configure a token to manipulate remote repositories',
    run: execute,
};