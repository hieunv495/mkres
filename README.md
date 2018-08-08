# Introduction

[![npm](https://img.shields.io/npm/v/mkres.svg) ![npm](https://img.shields.io/npm/dm/mkres.svg)](https://www.npmjs.com/package/mkres)


Best way create Restful API in express


# Smart Select Attribute

```js
const {parseSelect} = require('mkres')
const User = require('mongoose').model('User')

let {select,populate} = parseSelect(User, 'user,address{street,city}')
let users = User.find({}).select(select).pupulate(populate)

console.logs('>> Users: ', users)

```

# Smart Find

```js
const {parseFind} = require('mkres')
const User = require('mongoose').model('User')

let findQuery = parseFind('age <= 3 or (age >=5 and age <9)')
let users = User.find(findQuery)

console.logs('>> Users: ', users)

```

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


Use 
```
GET /users/?select=-_id,username,address{city},address{street}
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

Use 
```
GET /users/?limit=10&offset=0&page=1&select=username,address{city}&find=(age>=1 and age<=3>) or (age > 5) 
```

Filter: 
* = : Equal
* != : Not equal
* > : Great than
* >= : Great than equal
* < : Less than
* <= : Less than equal
* in : In list. Example:  fin=1,2,3
* nin: Not in list. Example: fnin=1,2,3

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

Use 
```
Post /users/?select=username,age,-_id
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

Use 
```
PUT /users/:id?select=username,age,-_id
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
Use 
```
DELETE /users/:id
```


# Development

```
docker-compose up
```