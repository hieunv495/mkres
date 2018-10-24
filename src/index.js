const makeFind = require('./makeFind')
const makeFindById = require('./makeFindById')
const makeDelete = require('./makeDelete')
const makeCreate = require('./makeCreate')
const makeUpdate = require('./makeUpdate')
const setMongoose = require('./mongooseConfig').setMongoose

const parseSelect = require('./parser/parseSelect') 
const parseFind = require('./parser/parseFind') 

module.exports = {
    setMongoose,
    parseSelect,
    parseFind,
    makeFind,
    makeFindById,
    makeDelete,
    makeCreate,
    makeUpdate
}