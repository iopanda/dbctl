CREATE KEYSPACE IF NOT EXISTS {{SYSKS}} WITH REPLICATION = {{{REPLICATION}}};

CREATE TABLE {{SYSKS}}.version (
    id      int,
    ver     TEXT,
    lsn     TEXT,
    cts     TIMESTAMP,
    uts     TIMESTAMP,
    PRIMARY KEY (id)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.meta (
    key     TEXT,
    val     TEXT,
    cts     TIMESTAMP,
    uts     TIMESTAMP,
    PRIMARY KEY (key)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.event (
    eid     TEXT,
    typ     TEXT,
    info    TEXT,
    cts     TIMESTAMP,
    PRIMARY KEY (eid)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.repo (
    rid     TEXT,
    eid     TEXT,
    cmt     TEXT,
    rbk     TEXT,
    cts     TIMESTAMP,
    PRIMARY KEY (rid)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.audit (
    aid     TEXT,
    bfs     TEXT,
    afs     TEXT,
    cts     TIMESTAMP,
    PRIMARY KEY (aid)
) {{TABLE_OPTS}};

INSERT INTO {{SYSKS}}.version(id,cts,uts,ver,lsn)
VALUES (0, currentTimestamp(), currentTimestamp(), '{{VERSION}}', '_');

INSERT INTO {{SYSKS}}.event(eid,cts,info,typ)
VALUES ('00000000-0000-0000-0000-000000000000', currentTimestamp(), 'dbctl install', 'install');
