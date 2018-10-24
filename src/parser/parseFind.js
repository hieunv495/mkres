const find_parser = require('./pegjs/find_parser.js')

let opMap = {
    '=': '$eq',
    '!=': '$ne',
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    in: '$in',
    nin: '$nin',
    '': '$eq'
}

const getMongoFindQuery = (data) => {

    if (!data.type) {
        return data
    }
    if (data.type == 'and') {
        return {
            $and: [getMongoFindQuery(data.left), getMongoFindQuery(data.right)]
        }
    } else if (data.type == 'or') {
        return {
            $or: [getMongoFindQuery(data.left), getMongoFindQuery(data.right)]
        }
    } else {
        return {
            [data.left]: {
                [opMap[data.type]]: getMongoFindQuery(data.right)
            }
        }
    }
}

module.exports.getMongoFindQuery = getMongoFindQuery

const parseFind = (text) => {
    if (!text) {
        return {}
    }
    let data = find_parser.parse(text)
    return getMongoFindQuery(data)
}

module.exports = parseFind

// const testFind = () => {
//     let query = parseFind('name=10 or (age >= 10 and age <20)')
// }

// // testFind()