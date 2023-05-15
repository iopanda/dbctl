CREATE KEYSPACE IF NOT EXISTS {{SYSKS}} WITH REPLICATION = {{{REPLICATION}}};

CREATE TABLE {{SYSKS}}.version (
    id      int,
    version     TEXT,
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP,
    PRIMARY KEY (id)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.namespaces (
    namespace   TEXT,
    schema_version TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (namespace)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.meta (
    key     TEXT,
    value     TEXT,
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP,
    PRIMARY KEY (key)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.event (
    event_id     TEXT,
    type     TEXT,
    info    TEXT,
    created_at     TIMESTAMP,
    PRIMARY KEY (event_id)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.repo (
    namespace   TEXT,
    repo_name     TEXT,
    event_id     TEXT,
    commit_script_base64     TEXT,
    rollback_script_base64     TEXT,
    created_at     TIMESTAMP,
    PRIMARY KEY (namespace, repo_name)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.history (
    id     TEXT,
    before     TEXT,
    after     TEXT,
    created_at     TIMESTAMP,
    PRIMARY KEY (id)
) {{TABLE_OPTS}};

INSERT INTO {{SYSKS}}.version(id,created_at,updated_at,version)
VALUES (0, currentTimestamp(), currentTimestamp(), '{{VERSION}}');

INSERT INTO {{SYSKS}}.event(event_id,created_at,info,type)
VALUES ('00000000-0000-0000-0000-000000000000', currentTimestamp(), 'dbctl install', 'install');
