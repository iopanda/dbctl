#!/bin/bash

dbctl config init
dbctl config set context.default.contactPoints '["doppstgjpe2cass101.onepoint-stg.jpe2b.dcnw.rakuten:80"]' -t object
dbctl config set context.default.port '80' -t object
dbctl config set context.default.dialect cassandra
dbctl config set context.default.localDataCenter stg-opp-jpe2b-01
dbctl config set context.default.keyspace system
dbctl config set context.default.credentials.username onepoint
dbctl config set context.default.credentials.password rakuten
dbctl config use-context default
dbctl config get-context $(dbctl config current-context)