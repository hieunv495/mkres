module.exports.withDefault = (val, defaultVal) => val === undefined ? defaultVal : val

module.exports.asyncWrapper = (f) => (req, res) => {
    f(req, res).catch(e => {
        console.log(e)
        res.status(400).json({
            message: 'error',
            error: e
        })
    })
}

module.exports.getMongoSelect = (model,selectData) => {
    console.log(model.schema.paths.address.options.ref)
}

module.exports.getMongoPopulate = (model,selectData) => {

}