const getFilterPath = require('./pegjs/getFilterPath')

const getFilterParams = (req) => {

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

    const getByType = (type) => {
        let query = type ? req.query['f_' + type] : req.query.f
        let op = type ? opMap[type] : '$eq'
        return Object.keys(query || {}).map(field => ({
            [field]: {
                [op]: query[field]
            }
        }))
    }

    let params = []

    for (let type of Object.keys(opMap)) {
        params.push(...getByType(type))
    }

    return params
}
module.exports = getFilterParams