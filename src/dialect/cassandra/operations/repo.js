const constants = require('../../../common/constants')

const addRepo = async (client, repo) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.repo (repo_id,event_id,commit_script_base64,rollback_script_base64,created_at) 
    VALUES ('${repo.id}', '${repo.eventId}', '${repo.commitContent}', '${repo.rollbackContent}', currentTimestamp())`
    await client.execute(cql)
}

const getRepo = async (client, id) => {
    const cql = `SELECT repo_id,event_id,commit_script_base64,rollback_script_base64,created_at from ${constants.SYSDB_NAME}.repo WHERE repo_id = '${id}'`
    const rs = (await client.execute(cql)).first()
    return {
        id: rs['repo_id'],
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