const {withDefault} = require('./utils')

const parser = {}

parser.parseBoolean = (val, defaultVal) => {
    if(typeof val === 'boolean') return val
    if (val === 'true' || val === 'yes' || val === '1') return true
    if (val === 'false' || val === 'no' || val === '0') return false
    return defaultVal
}

parser.parseInt = (val, defaultVal) => withDefault(val?parseInt(val): undefined, defaultVal)

parser.parseFloat = (val, defaultVal) => withDefault(val?parseFloat(val): undefined, defaultVal)

parser.parseListString = (val, defaultVal) => withDefault(val?val.split(','): undefined, defaultVal)

parser.parseListInt = (val, defaultVal) => withDefault(val?val.split(',').map(v => parseInt(v.trim())) : undefined, defaultVal)

parser.parseListFloat = (val, defaultVal) => withDefault(val?val.split(',').map(v => parseFloat(v.trim())) : undefined, defaultVal)

module.exports = parser