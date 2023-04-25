const fs = require('fs-extra')
const yaml = require('js-yaml')
const path = require('path')
const klawSync = require('klaw-sync')
const Mustache = require('mustache')
const { Base64 } = require('js-base64')

const loadFileContent = (file, values) => {
    let raw = fs.readFileSync(file).toString()
    if(values != null){
        raw = replaceVariables(raw, values)
    }
    const sqls = convertScriptToExecutableSqls(raw)
    return {
        raw: Base64.encode(raw),
        sqls: sqls
    }
}

const convertScriptToExecutableSqls = text => {
    // need enhance this function
    // 1. remove comment by reg
    // 2. remove blank lines and blank words
    // 3. replace seprator
    // 4. build sqls
    return text.replace(/\n\n/, '\n')
        .split('\n')
        .map(it => it.trim())
        .filter(it => !it.startsWith('-') && !it.startsWith('//') && !it.startsWith('\n'))
        .join('\n')
        .split(';')
        .map(it => it.split('\n').join(''))
        .map(it => it.trim())
        .filter(it => it != '')
}

const loadValueYamlFile = file => {
    if(!fs.existsSync(file)) return {}
    return yaml.load(fs.readFileSync(file, 'utf-8'))
}

const combineObjects = (...objs) => Object.assign(...objs)
const replaceVariables = (str, values) => Mustache.render(str, values || process.env)

const ascSort = (a, b) => a.name < b.name ? -1 : 1

const getSqlFilePathSortedList = dir => {
    return klawSync(dir, {
        nodir: true, 
        depthLimit: 0, 
    }).map(it => path.parse(it.path))
    .filter(it => it.ext == '.sql')
    .sort(ascSort)
}

const convertDictToArray = dict => {
    const result = []
    for(let k in dict){
        result.push(dict[k])
    }
    return result
}

const scriptDirProcess = dir => {
    const flist = getSqlFilePathSortedList(dir)
    const completedScriptDict = {}
    const uncompletedMessages = []
    // Check unavailable file name
    flist.forEach(it => {
        const clips = it.name.split('.')
        if(clips.length != 2){
            uncompletedMessages.push({
                name: it.name,
                message: `Naming of file ${it.name} is not follow standard. Please follow the naming <NAME>.<commit|rollback>.sql `
            })
        } else {
            const scriptName = clips[0]
            const scriptMode = clips[1]
            const content = loadFileContent(path.format(it))
            if(!completedScriptDict[scriptName]){
                completedScriptDict[scriptName] = {name: scriptName}
            }
            completedScriptDict[scriptName][scriptMode] = content
        }
    })
    // Check non-completed scripts
    const scriptArray = convertDictToArray(completedScriptDict).sort(ascSort)
    scriptArray.forEach(it => {
        if(!it.commit){
            uncompletedMessages.push({
                name: it.name,
                message: `Script ${it.name} is not completed. Please add file named ${it.name}.commit>.sql`
            })
        }
        if(!it.rollback){
            uncompletedMessages.push({
                name: it.name,
                message: `Script ${it.name} is not completed. Please add file named ${it.name}.rollback.sql`
            })
        }
    })
    
    if(uncompletedMessages.length > 0){
        uncompletedMessages.forEach(it => console.warn(`WARN :: ${it.message}`))
        return false
    }
    return scriptArray
}

module.exports = {
    loadFileContent: loadFileContent,
    replaceVariables: replaceVariables,
    loadValueYamlFile: loadValueYamlFile,
    combineObjects: combineObjects,
    getSqlFilePathSortedList: getSqlFilePathSortedList,
    convertScriptToExecutableSqls: convertScriptToExecutableSqls,
    scriptDirProcess: scriptDirProcess
}