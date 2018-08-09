
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ModelSchema = new Schema({
  street: String,
  city: String,
  boss: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},{
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  } 
})

ModelSchema.virtual('users',{
  ref: 'User',
  localField: '_id',
  foreignField: 'address',
  justOne: false
})

const Model = mongoose.model('Address', ModelSchema)
module.exports = Model
