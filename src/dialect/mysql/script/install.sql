CREATE DATABASE IF NOT EXISTS {{SYSKS}};

CREATE TABLE {{SYSKS}}.version (
    id      int,
    version     TEXT,
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE {{SYSKS}}.namespaces (
    namespace   varchar(255),
    schema_version varchar(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (namespace)
);

CREATE TABLE {{SYSKS}}.meta (
    mkey     varchar(255),
    value     varchar(255),
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP,
    PRIMARY KEY (mkey)
);

CREATE TABLE {{SYSKS}}.event (
    event_id     varchar(255),
    type     varchar(255),
    info    varchar(255),
    created_at     TIMESTAMP,
    PRIMARY KEY (event_id)
);

CREATE TABLE {{SYSKS}}.repo (
    namespace   varchar(255),
    repo_name     varchar(255),
    event_id     varchar(255),
    commit_script_base64     TEXT,
    rollback_script_base64     TEXT,
    created_at     TIMESTAMP,
    PRIMARY KEY (namespace, repo_name)
);

CREATE TABLE {{SYSKS}}.history (
    id     varchar(255),
    before     TEXT,
    after     TEXT,
    created_at     TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT INTO {{SYSKS}}.version(id,created_at,updated_at,version)
VALUES (0, now(), now(), '{{VERSION}}');

INSERT INTO {{SYSKS}}.event(event_id,created_at,info,type)
VALUES ('00000000-0000-0000-0000-000000000000', now(), 'dbctl install', 'install');
