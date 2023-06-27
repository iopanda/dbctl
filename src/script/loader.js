const fs = require('fs-extra')
const yaml = require('js-yaml')
const path = require('path')
const klawSync = require('klaw-sync')
const Mustache = require('mustache')
const { Base64 } = require('js-base64')

const loadFileContent = (file, values=process.env) => {
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
    // TODO: need enhance this function
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

const getYamlFilePathSortedList = dir => {
    const scanDir = path.resolve(dir)
    return klawSync(dir, {
        nodir: false, 
        depthLimit: -1,
    }).map(it => path.parse(it.path)).map(it => {
        it.root = scanDir,
        it.dir = it.dir.slice(scanDir.length + 1)
        return it
    }).filter(
        it => it.ext == '.yaml' || it.ext == '.yml'
    ).sort(ascSort)
}

const getYamlValuesByGivenName = (dir, name) => {
    const ylist = getYamlFilePathSortedList(dir)
    // 1. Get Common Values
    let cv = {}
    ylist.filter(it => it.dir == '').forEach(it => {
        const fp = path.join(it.root, it.dir, it.base)
        cv = loadValueYamlFile(fp)
    })

    // 2. Get Spec Values
    let sv = {}
    ylist.filter(it => it.dir == name).forEach(it => {
        const fp = path.join(it.root, it.dir, it.base)
        sv = loadValueYamlFile(fp)
    })

    // 3. Merge common and spec values
    return combineObjects(cv, sv, process.env)
}

const convertDictToArray = dict => {
    const result = []
    for(let k in dict){
        result.push(dict[k])
    }
    return result
}

const scriptDirProcess = (dir, values, tag) => {
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
        } else if (tag && clips[0] <= tag) {

        } else {
            const scriptName = clips[0]
            const scriptMode = clips[1]
            const content = loadFileContent(path.format(it), values)
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
    scriptDirProcess: scriptDirProcess,
    getYamlFilePathSortedList: getYamlFilePathSortedList,
    getYamlValuesByGivenName: getYamlValuesByGivenName,
    convertDictToArray:convertDictToArray,
    ascSort: ascSort
}