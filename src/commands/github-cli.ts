import { GluegunCommand, GluegunToolbox } from 'gluegun';

const command: GluegunCommand = {
  name: 'github-cli',
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox;
    print.info('Use help to see the avaliable options');
  },
}

module.exports = command;
