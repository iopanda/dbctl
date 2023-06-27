const constants = require('../../../common/constants')

class Namespace {
    constructor(client, data){
        this.client = client
        this.namespace = data.namespace
        this.version = data.version
    }

    async save() {
        const cql = `UPDATE ${constants.SYSDB_NAME}.namespaces SET schema_version = '${this.version}', created_at = currentTimestamp(), updated_at = currentTimestamp() WHERE namespace = '${this.namespace}'`
        const rs = await this.client.execute(cql)
        return rs
    }

    async update(){
        const cql = `UPDATE ${constants.SYSDB_NAME}.namespaces SET schema_version = '${this.version}', updated_at = currentTimestamp() WHERE namespace = '${this.namespace}'`
        const rs = await client.execute(cql)
        return rs
    }
}

Namespace.create = async (client) => {
    const cql = `CREATE TABLE ${constants.SYSDB_NAME}.namespaces ( namespace TEXT, schema_version TEXT, created_at TIMESTAMP, updated_at TIMESTAMP, PRIMARY KEY (namespace) )`
    const rs = await client.execute(cql)
    return rs
}

Namespace.find = async (client, data) => {
    const cql = `SELECT schema_version from ${constants.SYSDB_NAME}.namespaces WHERE namespace = '${data.namespace}'`
    const rs = await client.execute(cql)
    return new Namespace(client, {
        namespace: rs['namespace'],
        version: rs['schema_version']
    })
}

Namespace.findOne = async (client, data) => {
    const cql = `SELECT schema_version from ${constants.SYSDB_NAME}.namespaces WHERE namespace = '${data.namespace}'`
    const rs = (await client.execute(cql)).first()
    if(!rs) return null
    return new Namespace(client, {
        namespace: rs['namespace'],
        version: rs['schema_version']
    })
}

Namespace.drop = async (client) => {
    const cql = `DROP TABLE ${constants.SYSDB_NAME}.namespaces`
    const rs = await client.execute(cql)
    return rs
}


module.exports = Namespace