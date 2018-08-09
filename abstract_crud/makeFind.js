const {
    asyncWrapper,
    parseSelect,
    parseFind
} = require('./utils')
const {
    getWithIdParam,
    getSortParams
} = require('./queryParamsGetter')
const queryParser = require('./queryParser')
const getPagination = require('./paginate')

const select_parser = require('./parser/select_parser')

/*
- paginate: done
    + paginate: if true then return pagination request else return list items
    + limit
    + offset
    + page
- sort: done
- select: done
- filter: done
- middleware: done
- queryCriteria: done
*/

const DEFAULT_PARAMS = {
    itemOnly: false,

    paginate: true,
    limit: 10,
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
        middleware = []
    } = options

    router.get('/', middleware, asyncWrapper(async (req, res) => {

        let {
            select,
            populate
        } = parseSelect(model, req.query.select)

        console.log('>> select: ', JSON.stringify(select))
        console.log('>> populate: ', JSON.stringify(populate))

        let fdp = finalDefaultParams = Object.assign({}, DEFAULT_PARAMS, defaultParams)
        let rqq = req.query

        let itemOnly = queryParser.parseBoolean(rqq.itemOnly, fdp.itemOnly)

        let paginate = queryParser.parseBoolean(rqq.paginate, fdp.paginate)
        let limit = queryParser.parseInt(rqq.limit, fdp.limit)
        let offset = queryParser.parseInt(rqq.offset, fdp.offset)
        let page = queryParser.parseInt(rqq.page, fdp.page)

        let sort = getSortParams(req, fdp.sort)
        let withId = getWithIdParam(req, fdp.withId)

        let findQuery = parseFind(req.query.find)

        let finalQuery = {
            $and: [query, findQuery]
        }

        if (!paginate) {
            let getItemsPromise = model.find(finalQuery).sort(sort).populate(populate).select(select)
            if (withId) {
                getItemsPromise = getItemsPromise.then(items => items.map(item => {
                    item.id = item._id
                    delete item._id
                    return item
                }))
            }
            let items = await getItemsPromise
            return res.json(items)
        }

        let data = await getPagination(model, finalQuery, {
            itemOnly,
            select,
            sort,
            populate,
            leanWithId: withId,
            limit,
            offset,
            page
        })

        return res.json(data)
    }))
}