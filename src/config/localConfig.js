const fs = require('fs-extra')
const constants = require('../common/constants')

const configDirExisted = () => {
    return fs.existsSync(constants.PATH.CONFIG_FILE)
}

const createConfigFile = () => {
    fs.createFileSync(constants.PATH.CONFIG_FILE)
    fs.writeJSONSync(constants.PATH.CONFIG_FILE, {})
}

const getConfigObject = () => {
    return JSON.parse(fs.readFileSync(constants.PATH.CONFIG_FILE).toString())
}

module.exports = {
    configExisted: configDirExisted,
    createConfigFile: createConfigFile,
    getConfigObject: getConfigObject
}