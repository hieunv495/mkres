const {asyncWrapper, withDefault} = require('./utils')
const {getSelectFields,getPopulateFields, getWithIdParam} = require('./queryParamsGetter')
const queryParser = require('./queryParser')
const getPagination = require('./paginate')

/*
- paginate:
    + paginate: if true then return pagination request else return list items
    + limit
    + offset
    + page
- sort
- select
- filter
- middleware
- find params
*/


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

const getSortParams = (req, defaultVal) => {
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

const DEFAULT_PARAMS = {
    itemOnly : false,

    paginate : true,
    limit : 10,
    offset: 0,
    page: 1,
    
    sort: undefined,
    select: undefined,
    populate: undefined,
    withId: false,
}

module.exports = (options) => {

    let {
        model,
        query = {},
        router,
        defaultParams = {},
    } = options

    router.get('/', asyncWrapper(async (req, res) => {
        
        let fdp = finalDefaultParams = Object.assign({},DEFAULT_PARAMS,defaultParams)
        let rqq = req.query

        let itemOnly = queryParser.parseBoolean(rqq.itemOnly,fdp.itemOnly)

        let paginate = queryParser.parseBoolean(rqq.paginate, fdp.paginate)
        let limit = queryParser.parseInt(rqq.limit,fdp.limit)
        let offset = queryParser.parseInt(rqq.offset, fdp.offset)
        let page = queryParser.parseInt(rqq.page,fdp.page)

        let sort = getSortParams(req,fdp.sort)
        let select = getSelectFields(req, fdp.select)
        let populate = getPopulateFields(req,fdp.populate)
        let withId = getWithIdParam(req,fdp.withId)
        
        let filterParams = getFilterParams(req)

        let finalQuery = query
        if (filterParams.length > 0) {
            finalQuery = {
                $and: [query,...filterParams]
            }
        }

        if(!paginate){
            let getItemsPromise = model.find(finalQuery).lean().sort(sort).populate(populate).select(select)
            if(withId){
                getItemsPromise = getItemsPromise.then(items => items.map(item => {
                    item.id = item._id
                    delete item._id
                    return item
                }))
            }
            let items =  await getItemsPromise
            return res.json(items)
        }

        return res.json( 
            await getPagination(model,finalQuery,{
            itemOnly,
            select,
            sort,
            populate,
            lean: true,
            leanWithId: withId,
            limit,
            offset,
            page
        })
        )
    }))
}