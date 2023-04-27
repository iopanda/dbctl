const fs = require('fs-extra')
const constants = require('../common/constants')

const configDirExisted = () => {
    return fs.existsSync(constants.PATH.CONFIG_FILE)
}

const createConfigFile = () => {
    fs.createFileSync(constants.PATH.CONFIG_FILE)
    writeConfigFile({})
}

const getConfigObject = () => {
    return JSON.parse(fs.readFileSync(constants.PATH.CONFIG_FILE).toString())
}

const writeConfigFile = obj => {
    fs.writeFileSync(constants.PATH.CONFIG_FILE, JSON.stringify(obj, null, 4))
}

const setPropertyValue = (name, value, isObject=false) => {
    const clips = name.split('.')
    if (['context'].indexOf(clips[0]) == -1) {
        throw Error(`Property name ${clips[0]} is not supported.`)
    }

    if(clips[0] == 'context'){
        const paths = clips.slice(1)
        const config = getConfigObject()
        let op = config
        for (let i in paths) {
            if (!op[paths[i]]) op[paths[i]] = {}
            if(i < paths.length - 1) op = op[paths[i]]
            else op[paths[i]] = isObject ? JSON.parse(value) : value
        }
        writeConfigFile(config)
    }
}

const setCurrentContext = contextName => {
    const fp = constants.PATH.CURRENT_CTX_POINTER
    if(!fs.existsSync(fp)){
        fs.createFileSync(fp)
    }
    fs.writeFileSync(fp, contextName)
}

const getContext = name => {
    const config = getConfigObject()
    return config[name]
}

const currentContextExisted = () => {
    return fs.existsSync(constants.PATH.CURRENT_CTX_POINTER)
}

const getCurrentContextName = () => {
    if(!currentContextExisted()) return 
    return fs.readFileSync(constants.PATH.CURRENT_CTX_POINTER, 'utf-8')
}

module.exports = {
    configExisted: configDirExisted,
    createConfigFile: createConfigFile,
    getConfigObject: getConfigObject,
    setPropertyValue: setPropertyValue,
    writeConfigFile: writeConfigFile,
    getContext: getContext,
    setCurrentContext: setCurrentContext,
    currentContextExisted: currentContextExisted,
    getCurrentContextName: getCurrentContextName
}