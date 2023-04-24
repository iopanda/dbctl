
const getUsername = () => process.env['DBCTL_USERNAME']
const getPassword = () => process.env['DBCTL_PASSWORD']

module.exports = {
    getUsername: getUsername,
    getPassword: getPassword
}