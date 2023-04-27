
const fs = require('fs-extra')
const assert = require('assert');
const localConfig = require('../../../../src/config/localConfig')
const constants = require('../../../../src/common/constants')
const Client = require('../../../../src/dialect/cassandra/driver/client')

describe('Test on dialect/cassandra/driver/client.js', () => {
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
            },
            protocolOptions: {
                port: 9042
            }
        }
    }
    const CQL = "SELECT data_center FROM system.local WHERE key = 'local'"

    describe('#Client', () => {
        it('Client can connect DB successfully', done  => {
            localConfig.createConfigFile()
            localConfig.writeConfigFile(CONFIG)
            const context = localConfig.getContext('default')
            const client = Client(context)
            client.execute(CQL).then( res => {
                assert.equal(res.first().get('data_center'), 'datacenter1')
                done()
            }, rej => {
                done(rej)
            }).catch(err => {
                done(err)
            }).finally(() => {
                client.shutdown()
            })
        })
    })
})