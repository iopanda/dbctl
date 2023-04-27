#!/bin/bash

dbctl config init
dbctl config set context.default.contactPoints '["localhost"]' -t object
dbctl config set context.default.dialect cassandra
dbctl config set context.default.localDataCenter datacenter1
dbctl config set context.default.keyspace system
dbctl config set context.default.credentials.username cassandra
dbctl config set context.default.credentials.password cassandra
dbctl config use-context default
dbctl config get-context $(dbctl config current-context)