const constants = require('../../../common/constants')

class Version {
    constructor(client, data){
        this.client = client
        this.id = data.id
        this.version = data.version
    }

    async save(){
        const cql = `UPDATE ${constants.SYSDB_NAME}.version SET version = '${this.version}' WHERE id = 0`
        const rs = await this.client.execute(cql)
        return rs
    }
}

Version.find = async (client, data) => {
    const cql = `SELECT version from ${constants.SYSDB_NAME}.version WHERE id = 0`
    const rs = (await client.execute(cql)).first()
    return new Version(client, {
        id: rs['id'],
        version: rs['version']
    })
}

Version.create = async (client) => {
    const cql = `CREATE TABLE ${constants.SYSDB_NAME}.version ( id int, version TEXT, created_at TIMESTAMP, updated_at TIMESTAMP, PRIMARY KEY (id) )`
    const rs = await client.execute(cql)
    return rs
}

Version.drop = async (client) => {
    const cql = `DROP TABLE ${constants.SYSDB_NAME}.version`
    const rs = await client.execute(cql)
    return rs
}

module.exports = Version