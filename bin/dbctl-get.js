const { Command } = require('commander')
const app = require('../src/app')

const cmd = new Command().name('get').description('get resources')
cmd
    .command('tables')
    .option('-c --catalog <catalog>')
    .action(options => { 
        app.get.tables(options.database)
    })

cmd
    .command('table')
    .option('-c --catalog <catalog>')
    .option('-t --table <table>')
    .action(options => { 
        app.get.table(options.database, options.table) 
    })

cmd
    .command('views')
    .option('-c --catalog <catalog>')
    .action(() => { 
        app.get.views() 
    })

cmd
    .command('view')
    .option('-c --catalog <catalog>')
    .option('-v --view <view>')
    .action(() => { 
        app.get.view() 
    })

module.exports = cmd