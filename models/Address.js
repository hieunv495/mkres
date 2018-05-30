
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ModelSchema = new Schema({
  street: String,
  city: String
})


const Model = mongoose.model('Address', ModelSchema)
module.exports = Model
