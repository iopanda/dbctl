
create keyspace {{KEYSPACE}} WITH REPLICATION = {{{REPLICATION}}};

create table {{KEYSPACE}}.{{PREFIX}}_hello (
   id      int,
   name     TEXT,
   PRIMARY KEY (id)
)