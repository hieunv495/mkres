const {asyncWrapper} = require('./utils')
const {getSelectFields,getPopulateFields, getWithIdParam} = require('./queryParamsGetter')
const {validationResult} = require('express-validator/check')

const DEFAULT_PARAMS = {
    select: undefined,
    populate: undefined,
    withId: false,
}

module.exports = (options) => {

    let {
        model,
        router,
        validators = [],
        defaultParams = {},
        middleware = []
    } = options

    router.post('/',middleware, validators,asyncWrapper(async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({message: 'Error',errors: errors.mapped()});
        }

        let fdp = finalDefaultParams = Object.assign({},DEFAULT_PARAMS,defaultParams)
        let rqq = req.query        

        let select = getSelectFields(req, fdp.select)
        let populate = getPopulateFields(req,fdp.populate)
        let withId = getWithIdParam(req,fdp.withId)

        let data = req.body

        let item = await model.create(data)

        if(populate.length > 0)
            item = await item.populate(populate).execPopulate()

        let returnItem = {}
        if(select.length > 0)
            select.forEach(field => returnItem[field] = item[field])
        else returnItem = item.toJSON()
        if(withId){
            returnItem.id = returnItem._id
            delete returnItem._id
        }

        res.json(returnItem)
    }))
}