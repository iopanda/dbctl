const assert = require('assert');
const fs = require('fs-extra')
const target = require('../../src/script/loader')
const constants = require('../../src/common/constants')

describe('Test on script/loader.js', () => {
    describe('#loadFileContent()', () => {
        it('Load sql file and parse it correctly', () => {
            const result = target.loadFileContent('test/script/assets/completedScripts/test1.commit.sql')
            assert.equal(result.sqls.length, 2)
        })

        it('Load sql file which template can be parsed', () => {
            const result = target.loadFileContent('test/script/assets/completedScripts/test2.commit.sql', {KS: "ks"})
            assert.equal(result.sqls.length, 2)
        })
    })

    describe('#replaceVariables', () => {
        it('Replace string with variables', () => {
            const result = target.replaceVariables("hello {{USER}}")
            assert.equal(result, `hello ${process.env.USER}`)
        })
    })

    describe('#loadValueYamlFile', () => {
        it('Load yaml values file', () => {
            const result = target.loadValueYamlFile('test/script/assets/completedScripts/values.yaml')
            assert.equal(result.KEYSPACE, 'common_ks')
        })
    })

    describe('#combineObject', () => {
        it('Combine objects', () => {
            const result = target.combineObjects({a: 1}, {b: 2}, {c: 3})
            assert.deepEqual(result, {
                a: 1, b: 2, c: 3
            })
        })
    })

    describe('#getFileList', () => {
        it('List sql files', () => {
            const result = target.getSqlFilePathSortedList('test/script/assets/completedScripts')
            assert.equal(result.length, 4)
            assert.equal(result[0].name < result[1].name, true)
        })
    })

    describe('#loadFileContent', () => {
        it('Convert script to sqls', () => {
            const text = fs.readFileSync('test/script/assets/completedScripts/test1.commit.sql', 'utf-8')
            const result = target.convertScriptToExecutableSqls(text)
            assert.equal(result.length, 2)
        })
    })

    describe('#scriptDirProcess', () => {
        it('Check script file failed if script not completed', () => {
            const result = target.scriptDirProcess('test/script/assets/incompletedScripts')
            assert.equal(result, false)
        })

        it('Check script file success if script completed', () => {
            const result = target.scriptDirProcess('test/script/assets/completedScripts')
            assert.notEqual(result, false)
        })
    })

    describe('#getYamlFilePathSortedList', () => {
        it('Check to get correct yaml files', () => {
            const result = target.getYamlFilePathSortedList('test/script/assets/completedScripts')
            assert.equal(result.length, 4)
        })
    })

    describe('#getYamlValuesByGivenName', () => {
        it('Check to get correct object from yaml files: (dev)', () => {
            const dir = 'test/script/assets/completedScripts'
            const name = 'dev'
            const result = target.getYamlValuesByGivenName(dir, name)
            assert.equal(result['KEYSPACE'], 'dev_ks')
        })
        it('Check to get correct object from yaml files: (uat)', () => {
            const dir = 'test/script/assets/completedScripts'
            const name = 'uat'
            const result = target.getYamlValuesByGivenName(dir, name)
            assert.equal(result['KEYSPACE'], 'uat_ks')
        })
        it('Check to get correct object from yaml files: (do_not_exist)', () => {
            const dir = 'test/script/assets/completedScripts'
            const name = 'do_not_exist'
            const result = target.getYamlValuesByGivenName(dir, name)
            assert.equal(result['KEYSPACE'], 'common_ks')
        })
        it('Check to get correct object from yaml files: (null)', () => {
            const dir = 'test/script/assets/completedScripts'
            const name = null
            const result = target.getYamlValuesByGivenName(dir, name)
            assert.equal(result['KEYSPACE'], 'common_ks')
        })
        it('Check to get correct object from yaml files: (conflict)', () => {
            const dir = 'test/script/assets/completedScripts'
            const name = 'conflict'
            const result = target.getYamlValuesByGivenName(dir, name)
            assert.equal(result['KEYSPACE'], 'conflict_ks')
        })
    })
})