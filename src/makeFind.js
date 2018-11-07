const {
    asyncWrapper
} = require('./utils')

const parseSelect = require('./parser/parseSelect')
const parseFind = require('./parser/parseFind')

const {
    getWithIdParam,
    getSortParams
} = require('./queryParamsGetter')
const queryParser = require('./queryParser')
const getPagination = require('./paginate')

const getFilterParams = require('./parser/getFilterParams')


const DEFAULT = {
    paginate: true,
    paginateItemOnly: false,
    limit: 10,
    offset: 0,
    page: 1,

    sort: undefined,
    select: undefined,
    withId: false,
}

module.exports = (options) => {

    let {
        router,
        model,
        middleware = [],
        listQuery = {}, // {} || function(req) || h
        enableParams = '*', // '*' or ['paginate','list']
        defaultParams = {},
    } = options

    router.get('/', middleware, asyncWrapper(async (req, res) => {

        let query = Object.assign({}, defaultParams, req.query)

        console.log(query)

        let selectData = parseSelect(model, query.select)

        let select = selectData.select
        let populate = selectData.populate

        let paginate = queryParser.parseBoolean(query.paginate, DEFAULT.paginate)
        let pagianteItemOnly = queryParser.parseBoolean(query.paginateItemOnly)

        let limit = queryParser.parseInt(query.limit, DEFAULT.limit)
        let offset = queryParser.parseInt(query.offset, DEFAULT.limit )
        let page = queryParser.parseInt(query.page, DEFAULT.page )

        let sort = getSortParams(query, DEFAULT.limit, DEFAULT.limi )
        let withId = getWithIdParam(query)

        let one = queryParser.parseBoolean(query.one)

        let findQuery = parseFind(query.find)

        let filterParams = getFilterParams(query)

        let finalQuery = {
            $and: [findQuery, ...filterParams]
        }

        console.log(finalQuery)

        if (one) {
            let item = await model.findOne(finalQuery).populate(populate).select(select)
            if (!item) {
                return res.status(404).json({
                    message: 'NotFound'
                })
            }
            return res.json(item)
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