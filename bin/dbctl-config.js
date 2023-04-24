const { Command } = require('commander')

const cmd = new Command().name('config').description('change configuration')

cmd.command('set').argument('<name>', 'Property name').argument('[value]', 'Property value').action((name, value) => {
    const clips = name.split('.')

    for(let i in clips){
        console.log(i)
    }
})

cmd.command('get-contexts').action(() => {})
cmd.command('use-contexts').action(() => {})

module.exports = cmd