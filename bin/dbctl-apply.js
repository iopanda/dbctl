const { Command, Option } = require('commander')
const fs = require('fs-extra')
const path = require('path')
const constants = require('../src/common/constants')
const loader = require('../src/script/loader')

const cmd = new Command().name('apply').description('apply change to database')

cmd
.addOption(new Option('-f --file <file>', 'script file location'))
.addOption(new Option('-d --dir <dir>', 'script dir'))
.addOption(new Option('-v --value <vname>', 'name of values'))
.action((options) => {
    if(options.file && options.dir){
        console.log(`You cannot use -f and -d by the same time.`)
        process.exit(3)
    }
    if(!options.file && !options.dir){
        console.log(`Please use "-f <file>" or "-d <dir>" to specify the script(s).`)
        process.exit(3)
    }
    if(options.file){
        const fp = path.join(constants.PATH.CWD, options.file)
        
    }
    if(options.dir){
        const dir = options.dir.startsWith('/') ? options.dir : path.join(constants.PATH.CWD, options.dir)
        const files = loader.scriptDirProcess(dir)
        fs.createFileSync('dist/sqls.json')
        fs.writeFileSync('dist/sqls.json', JSON.stringify(files, null, 4))
        console.log(files)
    }
})

module.exports = cmd