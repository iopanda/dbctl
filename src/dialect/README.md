# Design of dbctl tables

## Database
- name: dbctl
## Tahles
- Version (1 single line, indicate current version of schema)
    id=0, ver, cts, uts
- Meta (3 columns, k-v & ts*2)
    key, val, cts, uts
- Event (commit_id, scripts, ts)
    eid, typ, info, cts
- Repository (id, commit_id, script+, script-, md5, cts)
    rid, eid, cmt, rbk, cts
- Audit (aid, before, after)
    eid, bf, af

## Cassandra

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