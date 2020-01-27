import { GluegunToolbox } from 'gluegun'
  
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.foo = () => {
    toolbox.print.info('called foo extension')
  }

  toolbox.hello = () => {
    toolbox.print.success(process.cwd());
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "github-cli" property),
  // github-cli.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "github-cli")
  // }
}
