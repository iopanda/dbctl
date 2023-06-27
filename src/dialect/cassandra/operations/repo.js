const constants = require('../../../common/constants')

class Repo {
    constructor(client, data){
        this.client = client
        this.name = data.name
        this.namespace = data.namespace
        this.eventId = data.eventId
        this.commitContent = data.commitContent
        this.rollbackContent = data.rollbackContent
    }

    async save(){
        const cql = `INSERT INTO ${constants.SYSDB_NAME}.repo (namespace, repo_name,event_id,commit_script_base64,rollback_script_base64,created_at)
            VALUES ('${this.namespace}','${this.id}', '${this.eventId}', '${this.commitContent}', '${this.rollbackContent}', currentTimestamp())`
        await this.client.execute(cql)
    }
}

Repo.find = async (client, data) => {
    const cql = `SELECT namespace,repo_name,event_id,commit_script_base64,rollback_script_base64,created_at from ${constants.SYSDB_NAME}.repo 
        WHERE namespace='${data.namespace}' and repo_name = '${data.repoName}'`
    const rs = (await client.execute(cql)).first()
    return new Repo(client, {
        namespace: rs['namespace'],
        id: rs['repo_name'],
        eventId: rs['event_id'],
        commitContent: rs['commit_script_base64'],
        rollbackContent: rs['rollback_script_base64'],
        createdAt: rs['created_at']
    })
}

Repo.create = async (client) => {
    const cql = `CREATE TABLE ${constants.SYSDB_NAME}.repo ( namespace TEXT, repo_name TEXT, event_id TEXT, commit_script_base64 TEXT, rollback_script_base64 TEXT, created_at TIMESTAMP, PRIMARY KEY (namespace, repo_name) )`
    const rs = await client.execute(cql)
    return rs
}

Repo.drop = async (client) => {
    const cql = `DROP TABLE ${constants.SYSDB_NAME}.repo`
    const rs = await client.execute(cql)
    return rs
}

module.exports = Repo