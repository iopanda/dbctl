
const getUsername = () => process.env['DBCTL_USERNAME']
const getPassword = () => process.env['DBCTL_PASSWORD']
const getDatabase = () => process.env['DBCTL_DATABASE']

module.exports = {
    getUsername: getUsername,
    getPassword: getPassword,
    getDatabase: getDatabase
}