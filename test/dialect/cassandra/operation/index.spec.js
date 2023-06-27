const fs = require('fs-extra')
const assert = require('assert');
const localConfig = require('../../../../src/config/localConfig')
const constants = require('../../../../src/common/constants')
const Client = require('../../../../src/dialect/cassandra/driver/client')
const {History, Event, Meta, Repo, Version} = require('../../../../src/dialect/cassandra/operations')



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
    
    describe('Test on history.js', () => {
        it('History can be insert and queried', async () => {
            const obj = {
                id: 'aid001',
                before: 'before',
                after: 'after'
            }
            await new History(PREDEFINED.client, obj).save()
            const rs = await History.find(PREDEFINED.client, obj)
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
            await new Event(PREDEFINED.client, obj).save()
            const rs = await Event.find(PREDEFINED.client, obj)
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
            await new Meta(PREDEFINED.client, obj).save()
            const rs1 = await Meta.find(PREDEFINED.client, obj)
            assert.equal(rs1.value, obj.value)
            
            rs1.value = 'v002'
            await rs1.save(PREDEFINED.client, obj)
            const rs2 = await Meta.find(PREDEFINED.client, obj)
            assert.equal(rs2.value, rs1.value)
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
            await new Repo(PREDEFINED.client, obj).save()
            const rs = await Repo.find(PREDEFINED.client, obj)
            assert.equal(rs.eventId, obj.eventId)
            assert.equal(rs.commitContent, obj.commitContent)
            assert.equal(rs.rollbackContent, obj.rollbackContent)
        })
    })

    describe('Test on version.js', () => {
        it('Version can be changed and get', async () => {
            const fn = "123"
            await new Version(PREDEFINED.client, {id: 0, version: fn}).save()
            const rs = await Version.find(PREDEFINED.client, {id: 0})
            assert.equal(rs.version, fn)
        })
    })
})