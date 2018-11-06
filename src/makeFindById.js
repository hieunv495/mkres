const {
    asyncWrapper
} = require('./utils')
const parseSelect = require('./parser/parseSelect')
const {
    getWithIdParam
} = require('./queryParamsGetter')

const DEFAULT_PARAMS = {
    select: undefined,
    populate: undefined,
    withId: false,
}

module.exports = (options) => {

    let {
        model,
        router,
        defaultParams = {},
        middleware = []
    } = options

    router.get('/:id', middleware, asyncWrapper(async (req, res) => {

        let fdp = finalDefaultParams = Object.assign({}, DEFAULT_PARAMS, defaultParams)
        let rqq = req.query

        let selectData = parseSelect(model, req.query.select)
        let extraData = parseSelect(model, req.query.extra)

        let select = selectData.select
        let populate = [...selectData.populate, ...extraData.populate]

        let withId = getWithIdParam(req, fdp.withId)

        let getItem = model.findById(req.params.id)

        if (populate.length > 0) getItem = getItem.populate(populate);

        if (select.length > 0) getItem = getItem.select(select.join(' '));

        item = await getItem

        if (!item) {
            return res.status(404).json({
                error: 'NotFound',
                message: 'Not Found!'
            })
        }

        if (withId) {
            item.id = item._id
            delete item._id
        }

        res.json(item)
    }))
}