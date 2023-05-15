const fs = require('fs-extra')
const assert = require('assert');
const localConfig = require('../../../../src/config/localConfig')
const constants = require('../../../../src/common/constants')
const Client = require('../../../../src/dialect/cassandra/driver/client')
const {Audit, Event, Meta, Repo, Version} = require('../../../../src/dialect/cassandra/operations')



describe('Test on dialect/cassandra/operations/index.js', () => {
    const CONFIG = {
        default: {
            contactPoints: ['localhost'],
            localDataCenter: 'datacenter1',
            dialect: "cassandra",
            keyspace: 'system',
            credentials: {
                username: 'cassandra',
                password: 'cassandra'
            }
        }
    }
    const PREDEFINED = {
        client: null
    }

    before(() => {
        fs.removeSync(constants.PATH.CONFIG_DIR)
        localConfig.createConfigFile()
        localConfig.writeConfigFile(CONFIG)
        localConfig.setCurrentContext('default')
        const context = localConfig.getContext('default')
        PREDEFINED.client = Client(context)
    })

    after(() => {
        fs.removeSync(constants.PATH.CONFIG_DIR)
        PREDEFINED.client.shutdown()
    })
    
    describe('Test on audit.js', () => {
        it('Audit can be insert and queried', async () => {
            const obj = {
                id: 'aid001',
                before: 'before',
                after: 'after'
            }
            await Audit.addAudit(PREDEFINED.client, obj)
            const rs = await Audit.getAudit(PREDEFINED.client, obj.id)
            assert.equal(rs.before, obj.before)
            assert.equal(rs.after, obj.after)
        })
    })

    describe('Test on event.js', () => {
        it('Event can be insert and queried', async () => {
            const obj = {
                id: 'e001',
                type: 'commit',
                info: 'this is a info'
            }
            await Event.addEvnet(PREDEFINED.client, obj)
            const rs = await Event.getEvent(PREDEFINED.client, obj.id)
            assert.equal(rs.type, obj.type)
            assert.equal(rs.info, obj.info)
        })
    })

    describe('Test on meta.js', () => {
        it('Meta can be insert, queried and updated', async () => {
            const obj = {
                key: 'm001',
                value: 'v001',
            }
            await Meta.addMeta(PREDEFINED.client, obj)
            const rs1 = await Meta.getMeta(PREDEFINED.client, obj.key)
            assert.equal(rs1.value, obj.value)
            
            obj.value = 'v002'
            await Meta.updateMeta(PREDEFINED.client, obj)
            const rs2 = await Meta.getMeta(PREDEFINED.client, obj.key)
            assert.equal(rs2.value, obj.value)
        })
    })

    describe('Test on repo.js', () => {
        it('Repo can be insert and queried', async () => {
            const obj = {
                namespace: 'namespace',
                id: 'r01',
                eventId: 'e01',
                commitContent: 'this is commitContent',
                rollbackContent: 'this is rollbackContent'
            }
            await Repo.addRepo(PREDEFINED.client, obj)
            const rs = await Repo.getRepo(PREDEFINED.client, obj.namespace, obj.id)
            assert.equal(rs.eventId, obj.eventId)
            assert.equal(rs.commitContent, obj.commitContent)
            assert.equal(rs.rollbackContent, obj.rollbackContent)
        })
    })

    describe('Test on version.js', () => {
        it('Version can be changed and get', async () => {
            const fn = "123"
            await Version.updateLastScriptName(PREDEFINED.client, fn)
            const rs = await Version.getLastScriptName(PREDEFINED.client)
            assert.equal(rs, fn)
        })
    })
})