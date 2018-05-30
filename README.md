# Introduction

[![npm](https://img.shields.io/npm/v/mkres.svg) ![npm](https://img.shields.io/npm/dm/mkres.svg)](https://www.npmjs.com/package/mkres)


Best way create Restful API in express

# Ussage

## Prepare model

### User

```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let UserSchema = new Schema({
  username: {
    type: String
  },
  firstName: String,

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

```

Address
```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ModelSchema = new Schema({
  street: String,
  city: String
})

const Model = mongoose.model('Address', ModelSchema)
module.exports = Model

```


## findById
```js
const express = require('express')
const {makeFindById} = require('mkres')

const app = express()
const router = express.Router()

makeFindById({
    router: router,
    model: User
})

app.use('/users',router)

```

## find
```js
const express = require('express')
const {makeFind} = require('mkres')

const app = express()
const router = express.Router()

makeFind({
    router: router,
    model: User,
    defaultLimit: 10 // for pagination
})

app.use('/users',router)

```

## create
```js
const {body} = require('express-validator/check')
const express = require('express')
const {makeCreate} = require('mkres')

const app = express()
const router = express.Router()

makeCreate({
    router: router,
    model: User,
    validators: [
        body('username').not().isEmpty().withMessage('Kkong duoc de trong')
    ]
})

app.use('/users',router)
```

## update
```js
const {body} = require('express-validator/check')
const express = require('express')
const {makeUpdate} = require('mkres')

const app = express()
const router = express.Router()

makeUpdate({
    router: router,
    model: User,
    validators: [
        body('username').not().isEmpty().withMessage('Kkong duoc de trong')
    ]
})

app.use('/users',router)
```

## delete
```js
const express = require('express')
const {makeDelete} = require('mkres')

const app = express()
const router = express.Router()

makeDelete({
    router: router,
    model: User
})

app.use('/users',router)
```
