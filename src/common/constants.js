
const me = require('../../package.json')
const path = require('path')

const HOME = process.env.HOME || process.env.USERPROFILE
process.env['DBCTL_VERSION'] = me.version

module.exports = {
    VERSION: me.version,
    SYSDB_NAME: "dbctl",
    PATH: {
        CWD: process.cwd(),
        PROOT: path.join(__dirname, '../../'),
        HOME: HOME,
        CONFIG_DIR: `${HOME}/.dbctl/`,
        CONFIG_FILE: `${HOME}/.dbctl/config.json`,
        CURRENT_CTX_POINTER: `${HOME}/.dbctl/current_context`
    }
}