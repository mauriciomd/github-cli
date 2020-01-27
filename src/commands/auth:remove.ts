import { GluegunToolbox } from 'gluegun';
import * as keytar from 'keytar';

interface User {
    username: string;
}

function isAuthObject(shouldBeAuth: any): shouldBeAuth is User {
    const auth = shouldBeAuth as User;
    if (auth.username) {
        if (typeof auth.username === 'string') {
            return true;
        }
    }

    return false;
}

async function execute(toolbox: GluegunToolbox) {
    const { print } = toolbox;
    const { options } = toolbox.parameters;
    
    if (!isAuthObject(options)) {
        print.info('github-cli auth:remove --username <user>');
        return;
    }

    if (await keytar.deletePassword('github', options.username)) {
        print.success('User removed with success');
    } else {
        print.error('User not found');
    }
}


module.exports = {
    name: 'auth:remove',
    description: 'Configure a token to manipulate remote repositories',
    run: execute,
};