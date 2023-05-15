const yaml = require('js-yaml');

module.exports = {
    json: obj => {
        console.log(JSON.stringify(obj, null, 4))
    },
    yaml: obj => {
        const json = JSON.parse(JSON.stringify(obj))
        console.log(yaml.dump(json))
    }
}