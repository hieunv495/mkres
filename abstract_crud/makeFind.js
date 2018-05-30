const {asyncWrapper,getSelectFields,getPopulateFields} = require('./utils')

const getPaginationParams = (req, defaultLimit = 20) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : defaultLimit
    let offset = req.query.offset ? parseInt(req.query.offset) : 0
    let page = req.query.page ? parseInt(req.query.page) : 1
    let skip = offset + limit * (page - 1)
    return {
        offset,
        page,
        skip,
        limit
    }
}

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

const getSortParams = (req) => {
    let sortString = req.query.sort
    if (!sortString) return null;
    let sortFields = sortString.split(',').map(field => field.trim())
    return sortFields.map(field => {
        if (field.startsWith('-')) {
            return [field.slice(1), -1]
        }
        return [field, 1]
    })
}


module.exports = (options) => {

    let {
        model,
        router,
        defaultLimit = 20
    } = options

    router.get('/', asyncWrapper(async (req, res) => {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log(fullUrl)
        console.log(typeof req.query.obj)
        let {
            page,
            offset,
            skip,
            limit
        } = getPaginationParams(req, defaultLimit)
        let filterParams = getFilterParams(req)
        let query = {}
        if (filterParams.length >= 1) {
            query = {
                $and: filterParams
            }
        }
        let sortParams = getSortParams(req)
        let selectFields = getSelectFields(req)
        let populateFields = getPopulateFields(req)

        let getItems = model.find(query).sort(sortParams).skip(skip).limit(limit)
        
        if (populateFields.length > 0) getItems = getItems.populate(populateFields);
        
        if (selectFields.length > 0) getItems = getItems.select(selectFields.join(' '));

        let getTotal = model.count(query)

        let [items, total] = await Promise.all([getItems, getTotal])

        let totalPages = Math.ceil((total - offset) / limit)

        res.json({
            limit,
            page,
            offset,
            total,
            totalPages,
            items
        })
    }))
}