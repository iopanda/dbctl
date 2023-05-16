/*
    PARAMS:
        - EVENT_ID: UUID
        - NAMESPACE: String
        - SCHEMA_VERSION: Last file name
        - COMMIT_SCRIPT_BASE64: Base64 encoding script content
        - ROLLBACK_SCRIPT_BASE64: Base64 encoding script content
*/

INSERT INTO {{SYSKS}}.event(event_id,created_at,info,type)
VALUES ('{{EVENT_ID}}', currentTimestamp(), 'dbctl apply', 'apply');

INSERT INTO {{SYSKS}}.namespaces (namespace,schema_version,created_at,updated_at)
VALUES ('{{NAMESPACE}}','{{SCHEMA_VERSION}}', currentTimestamp(), currentTimestamp());

INSERT INTO {{SYSKS}}.repo(repo_id,event_id,commit_script_base64,rollback_script_base64,created_at) 
VALUES ('{{REPO_ID}}', '{{EVENT_ID}}', '{{COMMIT_SCRIPT_BASE64}}', 'ROLLBACK_SCRIPT_BASE64', currentTimestamp());