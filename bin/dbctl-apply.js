const { Command, Option } = require('commander')
const fs = require('fs-extra')
const path = require('path')
const constants = require('../src/common/constants')
const loader = require('../src/script/loader')

const cmd = new Command().name('apply').description('apply change to database')

cmd
.addOption(new Option('-f --folder <folder>', 'script folder location'))
.addOption(new Option('-v --value <vname>', 'name of values'))
.action((options) => {
    if(!options.folder){
        console.log(`Please use "-f <file>" to specify the folder of script(s).`)
        process.exit(3)
    }
    if(options.folder){
        const fp = path.join(constants.PATH.CWD, options.file)
        const values = loader.getYamlValuesByGivenName(fp, options.vname)
        const scripts = loader.scriptDirProcess(fp, values)
        

        fs.createFileSync('dist/sqls.json')
        fs.writeFileSync('dist/sqls.json', JSON.stringify(files, null, 4))
        console.log(files)
    }
})

module.exports = cmd