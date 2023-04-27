const yaml = require('js-yaml');

module.exports = {
    json: obj => {
        console.log(JSON.stringify(obj, null, 4))
    },
    yaml: obj => {
        console.log(yaml.dump(obj))
    }
}