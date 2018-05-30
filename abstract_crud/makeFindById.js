const {asyncWrapper,getSelectFields,getPopulateFields} = require('./utils')

module.exports = (options) => {

    let {
        model,
        router
    } = options

    router.get('/:id', asyncWrapper(async (req, res) => {
        
        let selectFields = getSelectFields(req)
        let populateFields = getPopulateFields(req)

        let getItem = model.findById(req.params.id)
        
        if (populateFields.length > 0) getItem = getItem.populate(populateFields);
        
        if (selectFields.length > 0) getItem = getItem.select(selectFields.join(' '));

        item = await getItem

        res.json(item)
    }))
}