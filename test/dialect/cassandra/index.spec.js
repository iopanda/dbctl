
const fs = require('fs-extra')
const assert = require('assert');
const localConfig = require('../../../src/config/localConfig')
const constants = require('../../../src/common/constants')
const database = require('../../../src/dialect/cassandra')

describe('Test on dialect/cassandra/index.js', () => {
    beforeEach(() => fs.removeSync(constants.PATH.CONFIG_DIR))
    afterEach(() => fs.removeSync(constants.PATH.CONFIG_DIR))
    const CONFIG = {
        default: {
            contactPoints: ['localhost'],
            localDataCenter: 'datacenter1',
            keyspace: 'system',
            credentials: {
                username: 'cassandra',
                password: 'cassandra'
            }
        }
    }

    describe('#getDbInfo', () => {
        it('Cassandra can get information from database correctly', done  => {
            localConfig.createConfigFile()
            localConfig.writeConfigFile(CONFIG)
            database.getDbInfo('default').then( res => {
                done()
            }, rej => {
                done(rej)
            }).catch(err => {
                done(err)
            })
        })
    })
})