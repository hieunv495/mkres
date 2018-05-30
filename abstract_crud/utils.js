module.exports.asyncWrapper = (f) => (req, res) => {
    f(req, res).catch(e => {
        console.log(e)
        res.status(400).json({
            message: 'error',
            error: e
        })
    })
}

module.exports.getSelectFields = (req) => req.query.select ? req.query.select.split(',') : []

module.exports.getPopulateFields = (req) => req.query.populate ? req.query.populate.split(',') : []