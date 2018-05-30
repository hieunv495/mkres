const {asyncWrapper} = require('./utils')

module.exports = (options) => {

    let {
        model,
        router
    } = options

    router.delete('/:id', asyncWrapper(async (req, res) => {
        let item = await model.findById(req.params.id)
        if(!item) return res.status(404).json({
            message: 'Not found',
        })
        await item.remove()
        return res.json({
            message: 'Success'
        })
    }))
}