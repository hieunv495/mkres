const mongoose = require('mongoose')

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

const parsePath = (path, data) => {


    let result = {
        select: [],
        populate: []
    }
    if (!data) {
        return result
    }

    if (path.schema && data.select) {
        data.select.forEach(childData => {
            let childPathName = childData.name

            let childPath = path.schema.paths[childPathName]

            if (!childPath) {
                result.select.push(childPathName)
                return
            }

            if (childData.type == 'remove') {
                result.select.push('-' + childPathName)
                return
            }

            if (childPath.options.ref && !childData.select) {
                result.select.push(childPathName)
                return
            }
            if (childPath.options.ref && childData.select && childData.select == 0) {
                result.select.push(childPathName)
                result.populate.push({
                    path: childPathName
                })
                return
            }
            if (childPath.options.ref) {
                console.log('>>> Ref ')
                let {
                    select,
                    populate
                } = parsePath(mongoose.model(childPath.options.ref), childData)

                result.select.push(childPathName)
                result.populate.push({
                    path: childPathName,
                    select: select.length > 0 ? select : undefined,
                    populate: populate.length > 0 ? populate : undefined
                })
                return
            }
            if (childPath.options.type[0] && childPath.options.type[0].ref && !childData.select) {
                result.select.push(childPathName)
                return
            }
            if (childPath.options.type[0] && childPath.options.type[0].ref && childData.select && childData.select == 0) {
                result.select.push(childPathName)
                result.populate.push({
                    path: childPathName
                })
                return
            }
            if (childPath.options.type[0] && childPath.options.type[0].ref) {
                console.log('>>> Array Ref ')
                let {
                    select,
                    populate
                } = parsePath(mongoose.model(childPath.options.type[0].ref), childData)

                result.select.push(childPathName)
                result.populate.push({
                    path: childPathName,
                    select: select.length > 0 ? select : undefined,
                    populate: populate.length > 0 ? populate : undefined
                })
                return
            } else {
                console.log('>>> Binh thuong')
                let {
                    select,
                    populate
                } = parsePath(childPath, childData)

                if (select.length == 0)
                    result.select.push(childPathName)
                else
                    result.select.push(...select.map(name => {
                        if (name.startsWith('-')) {
                            return '-' + childPathName + '.' + name.substr(1)
                        }
                        return childPathName + '.' + name
                    }))

                result.populate.push(...populate.map(({
                    path,
                    select,
                    populate
                }) => ({
                    path: childPathName + '.' + path,
                    select: select.length > 0 ? select : undefined,
                    populate: populate.length > 0 ? populate : undefined
                })))
            }

        })
    }

    return result
}

const select_parser = require('./parser/select_parser.js')

const parseSelect = (model, text) => {
    console.log(text)
    if (!text)
        return {
            select: [],
            populate: []
        }
    let data = select_parser.parse(text)
    return parsePath(model, {
        select: data
    })
}

const testParsePath = () => {
    const User = require('mongoose').model('User')
    let text = 'username,birthday{date,year,month},address{street,adf},addresses{street,boss{name}}'

    let {
        select,
        populate
    } = parseSelect(User, text)

    console.log('>> Select: ', JSON.stringify(select))
    console.log('>> Populate: ', JSON.stringify(populate))

}

testParsePath()


module.exports.parseSelect = parseSelect