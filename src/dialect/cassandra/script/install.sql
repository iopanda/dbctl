CREATE KEYSPACE IF NOT EXISTS {{SYSKS}} WITH REPLICATION = {{REPLICATION}};

CREATE TABLE {{SYSKS}}.version (
    id      int,
    ver     TEXT,
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
    cts     TIMESTAMP
    PRIMARY KEY (rid)
) {{TABLE_OPTS}};

CREATE TABLE {{SYSKS}}.audit (
    aid     TEXT,
    bfs     TEXT,
    afs     TEXT,
    cts     TIMESTAMP
    PRIMARY KEY (aid)
) {{TABLE_OPTS}};