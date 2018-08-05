
const mongoose = require('mongoose')
const Schema = mongoose.Schema


let BirthdaySchema = new Schema({
  date: Number,
  month: Number,
  year: Number
})

let UserSchema = new Schema({
  username: {
    type: String
  },
  firstName: String,

  birthday: BirthdaySchema,
  age: Number,

  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },

  addresses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Address'
    }
  ]

}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})


const User = mongoose.model('User', UserSchema)
module.exports = User
