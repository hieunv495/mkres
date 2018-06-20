const {withDefault} = require('./utils')
const queryParser = require('./queryParser')

module.exports.getSelectFields = (req, defaultVal = []) => req.query.select ? req.query.select.split(',') : defaultVal

module.exports.getPopulateFields = (req, defaultVal = []) => req.query.populate ? req.query.populate.split(',') : defaultVal

module.exports.getWithIdParam = (req, defaultVal) => {
    return queryParser.parseBoolean(req.query.withId, defaultVal)
}