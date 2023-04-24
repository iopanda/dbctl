
const me = require('../../package.json')
const HOME = process.env.HOME || process.env.USERPROFILE
module.exports = {
    VERSION: me.version,
    SYSDB_NAME: "dbctl",
    PATH: {
        CWD: process.cwd(),
        HOME: HOME,
        CONFIG_DIR: `${HOME}/.dbctl/`,
        CONFIG_FILE: `${HOME}/.dbctl/config.json`
    }
}