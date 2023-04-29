
create keyspace {{KEYSPACE}}2 WITH REPLICATION = {{{REPLICATION}}};

create table {{KEYSPACE}}2.{{PREFIX}}_hello (
   id      int,
   name     TEXT,
   PRIMARY KEY (id)
)