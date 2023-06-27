
const fs = require('fs-extra')
const assert = require('assert');
const localConfig = require('../../../../src/config/localConfig')
const constants = require('../../../../src/common/constants')
const database = require('../../../../src/dialect/cassandra')
const target = require('../../../../src/dialect/cassandra/script')
const Client = require('../../../../src/dialect/cassandra/driver/client')

describe('Test on dialect/cassandra/script/index.js', () => {
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

    describe('#getInfoSqls', () => {
        it('Get SQLs for fetch info from Cassandra', async () => {
            localConfig.createConfigFile()
            localConfig.writeConfigFile(CONFIG)
            const context = localConfig.getContext('default')
            const client = Client(context)

            const versionResult = await client.execute(target.getVersionSql())
            const version = `v${versionResult.first().get('version')[0]}`
            const sqls = target.getInfoSqls(version)
            const execList = Object.keys(sqls).map(it => {
                return client.execute(sqls[it])
            })
            return Promise.all(execList).finally(() => {
                client.shutdown()
            })
        })
    })

})