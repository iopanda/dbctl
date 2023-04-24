const assert = require('assert');
const fs = require('fs-extra')
const target = require('../../src/script/loader')
const constants = require('../../src/common/constants')

describe('Test on script/loader.js', () => {
    describe('#loadFileContent()', () => {
        it('Load sql file and parse it correctly', () => {
            const result = target.loadFileContent('test/script/assets/test1.sql')
            assert.equal(result.length, 10)
            assert.equal(result[2], `CREATE TABLE users (username varchar,firstname varchar,lastname varchar,email varchar,password varchar,created_date timestamp,total_credits int,credit_change_date timeuuid,PRIMARY KEY (username))`)
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
            const result = target.loadValueYamlFile('test/script/assets/values.yaml')
            assert.equal(result.KEYSPACE, 'keyspace')
            assert.equal(result.TABLENAME, 'tablename')
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
            const result = target.getSqlFilePathSortedList('test/script/assets')
            assert.equal(result.length, 2)
            assert.equal(result[0].name < result[1].name, true)
        })
    })
})