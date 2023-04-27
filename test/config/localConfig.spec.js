const assert = require('assert');
const fs = require('fs-extra')
const target = require('../../src/config/localConfig')
const constants = require('../../src/common/constants')

describe('Test on config/localConfig.js', () => {
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

    describe('#writeConfigFile', () => {
        it('Write object to config file', () => {
            const config = {default: {dialect: "mysql"}}
            target.createConfigFile()
            target.writeConfigFile(config)
            assert.deepEqual(target.getConfigObject(), config)
        })
    })

    describe('#setPropertyValue', () => {
        it('Set config with property name and value', () => {
            target.createConfigFile()
            target.setPropertyValue('context.default.dialect', 'mysql')
            target.setPropertyValue('context.default.host', 'localhost')
            target.setPropertyValue('context.default.port', '3306')
            assert.deepEqual(target.getConfigObject(), {
                default: {
                    dialect: "mysql",
                    host: "localhost",
                    port: "3306"
                }
            })
        })
    })

    describe('#getContext', () => {
        it('Get context correctly', () => {
            target.createConfigFile()
            target.setPropertyValue('context.default.dialect', 'mysql')
            target.setPropertyValue('context.default.host', 'localhost')
            target.setPropertyValue('context.default.port', '3306')
            target.setPropertyValue('context.another.dialect', 'postgresql')
            target.setPropertyValue('context.another.host', 'localhost')
            target.setPropertyValue('context.another.port', '5432')
            assert.deepEqual(target.getContext('default'), {
                dialect: "mysql",
                host: "localhost",
                port: "3306"
            })
            assert.deepEqual(target.getContext('another'), {
                dialect: "postgresql",
                host: "localhost",
                port: "5432"
            })
        })
    })

    describe('#setCurrentContext', () => {
        it('Set current context', () => {
            target.createConfigFile()
            target.setPropertyValue('context.default.dialect', 'mysql')
            target.setCurrentContext('default')
            const text = fs.readFileSync(constants.PATH.CURRENT_CTX_POINTER, 'utf-8')
            assert.equal(text, 'default')
        })
    })
})