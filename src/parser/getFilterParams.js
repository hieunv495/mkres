const getFilterPath = require('./pegjs/getFilterPath')

const getFilterParams = (query) => {
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

    let keys = Object.keys(query).filter(key => key.startsWith('f'))

    keys.forEach(key => {
        let value = query[key]
        let op = key.split('_')[0].slice(1)
        if (op === 'in' || op == 'nin') {
            if (!value) {
                return
            }
            if (typeof value === 'string' || value instanceof String) {
                value = value.split(',')
            }
        }
        let field = key.slice(op.length + 2)
        let param = {}
        param[field] = {}
        param[field][opMap[op]] = value
        params.push(param)
    })
    console.log(params)
    return params
}
module.exports = getFilterParams