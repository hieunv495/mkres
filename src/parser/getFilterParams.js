
const getFilterParams = (req) => {
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
        if(key === 'find'){
            return
        }
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
module.exports = getFilterParams