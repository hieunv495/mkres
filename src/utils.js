

module.exports.withDefault = (val, defaultVal) => val === undefined ? defaultVal : val

module.exports.asyncWrapper = (f) => (req, res) => {
    f(req, res).catch(e => {
        console.log(e)
        res.status(400).json({
            message: e.message || 'error',
            error: e
        })
    })
}

