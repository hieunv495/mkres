# Introduction

[![npm](https://img.shields.io/npm/v/mkres.svg) ![npm](https://img.shields.io/npm/dm/mkres.svg)](https://www.npmjs.com/package/mkres)


Best way create Restful API in express and mongoose

# install

```js
const mongoose = require('mongoose')
require('mkres').setMongoose(mongoose)
```

# Smart Select Attribute

```js
const {parseSelect} = require('mkres')
const User = require('mongoose').model('User')

let {select,populate} = parseSelect(User, 'username,address{street,city,users},...')
let users = User.find({}).select(select).pupulate(populate)

console.logs('>> Users: ', users)

```

## Select text format

* field_1,field_2,field_n : Select declared fields
* field_1,field_2,...: Select declared fields and all other fields in schema
* field_1,field_2{ child_field_1, child_field2} : Populate and select child_field
* field_1,field_2{child_field,...} : Populate and select child field and all other child fields of field_2
* "..." : Select all other fields

## Populate and Deep Populate

We can populate by format:
```
field{} // Populate and select all child field 
```
or
```
field{f1,f2} // Populate and select declared child field
```
or
```
field{...,f1{}} // Populate and select all child field and populate child field 
```

**We can deep populate:**
```
field{f{ff{fff1,fff2},...}}
```

**Spread "..." is select all other fields**

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

### Address
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


#### Use 
```
GET /users/?select=-_id,username,address{city},address{street}
```

Params:
* **select**: select option, return only declared field
* **extra**: return extra declared field, ( use when you want populate some field but select all field)

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

#### Use 
```
GET /users/?limit=10&offset=0&page=1&select=username,address{city}&find=(age>=1 and age<=3>) or (age > 5) 
```

Params:
* **limit**: size of one page
* **offset**: offset of first item
* **select**: select option, return only declared field
* **extra**: return extra declared field, ( use when you want populate some field but select all field)
* **find**: simple condition for find item in mongo 
* **one** : return one item

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

Params:
* **select**: select option, return only declared field
* **extra**: return extra declared field, ( use when you want populate some field but select all field)

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

#### Use 
```
PUT /users/:id?select=username,age,-_id
```

Params:
* **select**: select option, return only declared field
* **extra**: return extra declared field, ( use when you want populate some field but select all field)

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
#### Use 
```
DELETE /users/:id
```


# Development

```
docker-compose up
```