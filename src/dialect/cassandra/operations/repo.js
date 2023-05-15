const constants = require('../../../common/constants')

const addRepo = async (client, repo) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.repo (namespace, repo_name,event_id,commit_script_base64,rollback_script_base64,created_at) 
    VALUES ('${repo.namespace}','${repo.id}', '${repo.eventId}', '${repo.commitContent}', '${repo.rollbackContent}', currentTimestamp())`
    await client.execute(cql)
}

const getRepo = async (client, namespace, repoName) => {
    const cql = `SELECT namespace,repo_name,event_id,commit_script_base64,rollback_script_base64,created_at from ${constants.SYSDB_NAME}.repo WHERE namespace='${namespace}' and repo_name = '${repoName}'`
    const rs = (await client.execute(cql)).first()
    return {
        namespace: rs['namespace'],
        id: rs['repo_name'],
        eventId: rs['event_id'],
        commitContent: rs['commit_script_base64'],
        rollbackContent: rs['rollback_script_base64'],
        createdAt: rs['created_at']
    }
}


module.exports = {
    addRepo: addRepo,
    getRepo: getRepo
}