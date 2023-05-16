#!/bin/bash

dbctl config init
dbctl config set context.default.dialect mysql
dbctl config set context.default.host localhost
dbctl config set context.default.port 3306
dbctl config set context.default.user root
dbctl config set context.default.password password
dbctl config use-context default
dbctl config get-context $(dbctl config current-context)