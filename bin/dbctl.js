#!/usr/bin/env node

const { Command } = require('commander')
const cmdApply = require('./dbctl-apply')
const cmdConfig = require('./dbctl-config')
const cmdDiff = require('./dbctl-diff')
const cmdExport = require('./dbctl-export')
const cmdGet = require('./dbctl-get')
const cmdInstall = require('./dbctl-install')
const cmdUninstall = require('./dbctl-uninstall')

const program = new Command();

program
    .name('dbctl')
    .description('Simple way to manage your database schema version')
    .version('1.0.0')

program.addCommand(cmdApply)
program.addCommand(cmdConfig)
// program.addCommand(cmdDiff)
program.addCommand(cmdExport)
// program.addCommand(cmdGet)
program.addCommand(cmdInstall)
program.addCommand(cmdUninstall)

program.parse(process.argv)
