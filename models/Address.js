
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ModelSchema = new Schema({
  street: String,
  city: String,
  boss: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})


const Model = mongoose.model('Address', ModelSchema)
module.exports = Model
