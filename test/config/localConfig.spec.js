const assert = require('assert');
const fs = require('fs-extra')
const target = require('../../src/config/localConfig')
const constants = require('../../src/common/constants')

describe('Test on localConfig.js', () => {
    beforeEach(() => fs.removeSync(constants.PATH.CONFIG_DIR))
    afterEach(() => fs.removeSync(constants.PATH.CONFIG_DIR))

    describe('#configDirExisted()', () => {
        it('Return false when config not exist', () => {
            assert.equal(target.configExisted(), false)
        })
        it('Return true if the config existed', () => {
            fs.createFileSync(constants.PATH.CONFIG_FILE)
            assert.equal(target.configExisted(), true)            
        })
    })

    describe('#createConfigFile()', () => {
        it('Create config file with blank object', () => {
             target.createConfigFile()
             assert.equal(target.configExisted(), true)
             assert.deepEqual(JSON.parse(fs.readFileSync(constants.PATH.CONFIG_FILE).toString()), {})
        })
    })

    describe('#getConfigObject()', () => {
        it('Get config file and convert to object successfully', () => {
            const config = {default: {dialect: "mysql"}}
            target.createConfigFile()
            fs.writeFileSync(constants.PATH.CONFIG_FILE, JSON.stringify(config, null, 4))
            assert.deepEqual(target.getConfigObject(), config)
        })
    })
})