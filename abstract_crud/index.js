const makeFind = require('./makeFind')
const makeFindById = require('./makeFindById')
const makeDelete = require('./makeDelete')
const makeCreate = require('./makeCreate')
const makeUpdate = require('./makeUpdate')

const {
    parseSelect,
    parseFind
} = require('./utils')

module.exports = {
    parseSelect,
    parseFind,
    makeFind,
    makeFindById,
    makeDelete,
    makeCreate,
    makeUpdate
}