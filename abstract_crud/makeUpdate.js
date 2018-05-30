const {asyncWrapper,getSelectFields,getPopulateFields} = require('./utils')
const {validationResult} = require('express-validator/check')

module.exports = (options) => {

    let {
        model,
        router,
        validators = []
    } = options

    router.put('/:id', validators,asyncWrapper(async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({message: 'Error',errors: errors.mapped()});
        }

        let data = req.body

        let item = await model.findById(req.params.id)

        if(!item) return res.status(404).json({message: 'Not Found'})

        Object.assign(item,data)
        item = await item.save()

        let populateFields = getPopulateFields(req)
        if(populateFields.length > 0)
            item = await item.populate(getPopulateFields(req)).execPopulate()

        let returnItem = {}
        let selectFields = getSelectFields(req)
        if(selectFields.length > 0)
            selectFields.forEach(field => returnItem[field] = item[field])
        else returnItem = item

        res.json(returnItem)
    }))
}