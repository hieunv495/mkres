const {
    withDefault
} = require('./utils')
const queryParser = require('./queryParser')

module.exports.getWithIdParam = (req, defaultVal) => {
    return queryParser.parseBoolean(req.query.withId, defaultVal)
}

module.exports.getSortParams = (req, defaultVal) => {
    let sortString = req.query.sort
    if (!sortString) return defaultVal;
    let sortFields = sortString.split(',').map(field => field.trim())
    return sortFields.map(field => {
        if (field.startsWith('-')) {
            return [field.slice(1), -1]
        }
        return [field, 1]
    })
}