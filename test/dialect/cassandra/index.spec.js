
const fs = require('fs-extra')
const assert = require('assert');
const localConfig = require('../../../src/config/localConfig')
const constants = require('../../../src/common/constants')
const database = require('../../../src/dialect/cassandra')

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

describe('Test on dialect/cassandra/index.js', () => {

    before(() => {
        fs.removeSync(constants.PATH.CONFIG_DIR)
        localConfig.createConfigFile()
        localConfig.writeConfigFile(CONFIG)
    })

    after(() => {
        fs.removeSync(constants.PATH.CONFIG_DIR)
    })

    describe('#getDbInfo', () => {
        it('Cassandra can get information from database correctly', async () => {
            return database.getDbInfo('default').then(res => {
                fs.createFileSync('reports/out.json')
                fs.writeFileSync('reports/out.json', JSON.stringify(res, null, 4))
            })
        })
    })

    describe('#executeSql', () => {
        it('Execute sql successfully', async () => {
            return database.executeSql('default', 'SELECT key FROM system.local').then(rs => {
                assert(rs.first().get('key'), 'local')
            })
        })
    })


})