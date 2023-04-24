const assert = require('assert');
const fs = require('fs-extra')
const target = require('../../src/config/envConfig')
const constants = require('../../src/common/constants')

describe('Test on config/envConfig.js', () => {
    describe('#getUsername', () => {
        it('Get username from environment variables', () => {
            const value = 'username'
            process.env['DBCTL_USERNAME'] = value
            assert.equal(target.getUsername(), value)
        })
    })

    describe('#getPassword', () => {
        it('Get password from environment variables', () => {
            const value = 'password'
            process.env['DBCTL_PASSWORD'] = value
            assert.equal(target.getPassword(), value)
        })
    })
})