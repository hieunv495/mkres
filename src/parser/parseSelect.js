const getMongoose = require('../mongooseConfig').getMongoose
const select_parser = require('./pegjs/select_parser.js')

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

                if (path.schema.virtuals[childPathName] && path.schema.virtuals[childPathName].options && path.schema.virtuals[childPathName].options.ref) {
                    result.select.push(childPathName)
                    if (!childData.select)
                        return

                    if (childData.select.length === 0) {
                        result.populate.push({
                            path: childPathName
                        })
                        return
                    }

                    let {
                        select,
                        populate
                    } = parsePath(getMongoose().model(path.schema.virtuals[childPathName].options.ref), childData)

                    result.populate.push({
                        path: childPathName,
                        select: select.length > 0 ? select : undefined,
                        populate: populate.length > 0 ? populate : undefined
                    })
                    return
                } else {
                    result.select.push(childPathName)
                    return
                }
            }

            if (childData.type == 'remove') {
                result.select.push('-' + childPathName)
                return
            }

            if (childPath.options.ref && !childData.select) {
                result.select.push(childPathName)
                return
            }
            if (childPath.options.ref && childData.select && childData.select.length === 0) {
                result.select.push(childPathName)
                result.populate.push({
                    path: childPathName
                })
                return
            }
            if (childPath.options.ref) {
                let {
                    select,
                    populate
                } = parsePath(getMongoose().model(childPath.options.ref), childData)

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
            if (childPath.options.type[0] && childPath.options.type[0].ref && childData.select && childData.select.length == 0) {
                result.select.push(childPathName)
                result.populate.push({
                    path: childPathName
                })
                return
            }
            if (childPath.options.type[0] && childPath.options.type[0].ref) {
                let {
                    select,
                    populate
                } = parsePath(getMongoose().model(childPath.options.type[0].ref), childData)

                result.select.push(childPathName)
                result.populate.push({
                    path: childPathName,
                    select: select.length > 0 ? select : undefined,
                    populate: populate.length > 0 ? populate : undefined
                })
                return
            }

            {
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
                    select: select && select.length > 0 ? select : undefined,
                    populate: populate && populate.length > 0 ? populate : undefined
                })))
            }

        })
    }
    if (data.all) {
        return {
            select: result.select.filter(i => i.startsWith('-')),
            populate: result.populate
        }
    }
    return result
}


const parseSelect = (model, text) => {
    if (!text)
        return {
            select: [],
            populate: []
        }
    let data
    try {
        data = select_parser.parse(text)
    } catch (e) {
        throw new Error('Select invalid')
    }
    return parsePath(model, data)
}

// const testParsePath = () => {
//     const User = require('mongoose').model('User')
//     let text = 'username,birthday{date,year,month},address{street,adf},addresses{street,boss{name}}'

//     let {
//         select,
//         populate
//     } = parseSelect(User, text)


// }


module.exports = parseSelect