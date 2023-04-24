const fs = require('fs-extra')
const yaml = require('js-yaml')
const path = require('path')
const klawSync = require('klaw-sync')
const Mustache = require('mustache')

const loadFileContent = path => {
    const content = fs.readFileSync(path).toString().replace(/\n\n/, '\n')
    return content
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
const replaceVariables = str => Mustache.render(str, process.env)

const getSqlFilePathSortedList = file => {
    return klawSync(file, {
        nodir: true, 
        depthLimit: 0, 
    }).map(it => path.parse(it.path))
    .filter(it => it.ext == '.sql')
    .sort((a, b) => a.name < b.name ? -1 : 1)
}

module.exports = {
    loadFileContent: loadFileContent,
    replaceVariables: replaceVariables,
    loadValueYamlFile: loadValueYamlFile,
    combineObjects: combineObjects,
    getSqlFilePathSortedList: getSqlFilePathSortedList
}