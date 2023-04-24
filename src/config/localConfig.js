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

const setPropertyValue = (name, value) => {
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
            else op[paths[i]] = value
        }
        writeConfigFile(config)
    }
}

const getContext = name => {
    const config = getConfigObject()
    return config[name]
}

module.exports = {
    configExisted: configDirExisted,
    createConfigFile: createConfigFile,
    getConfigObject: getConfigObject,
    setPropertyValue: setPropertyValue,
    writeConfigFile: writeConfigFile,
    getContext: getContext
}