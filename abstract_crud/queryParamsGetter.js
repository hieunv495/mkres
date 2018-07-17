const {withDefault} = require('./utils')
const queryParser = require('./queryParser')

module.exports.getSelectFields = (req, defaultVal = []) => req.query.select ? req.query.select.split(',') : defaultVal

module.exports.getPopulateFields = (req, defaultVal = []) => req.query.populate ? req.query.populate.split(',') : defaultVal

module.exports.getWithIdParam = (req, defaultVal) => {
    return queryParser.parseBoolean(req.query.withId, defaultVal)
}

module.exports.getFilterParams = (req) => {
    let params = []

    let opMap = {
        eq: '$eq',
        ne: '$ne',
        gt: '$gt',
        gte: '$gte',
        lt: '$lt',
        lte: '$lte',
        in: '$in',
        nin: '$nin',
        '': '$eq'
    }

    let keys = Object.keys(req.query).filter(key => key.startsWith('f'))

    keys.forEach(key => {
        let value = req.query[key]
        let op = key.split('_')[0].slice(1)
        if (op === 'in' || op == 'nin') {
            value = value.split(',')
        }
        let field = key.slice(op.length + 2)
        let param = {}
        param[field] = {}
        param[field][opMap[op]] = value
        params.push(param)
    })

    return params
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