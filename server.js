const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')

const {body} = require('express-validator/check')

var app = express()

let mongodb = mongoose.connect('mongodb://localhost:27017/test_restful')

const User = require('./models/User')
const Address = require('./models/Address')
const {makeFind,makeFindById,makeDelete,makeCreate,makeUpdate} = require('./abstract_crud')


// BODY
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))


makeFind({
    router: app,
    model: User,
    defaultLimit: 10
})
makeFindById({
    router: app,
    model: User
})
makeDelete({
    router: app,
    model: User
})
makeCreate({
    router: app,
    model: User,
    validators: [
        body('username').not().isEmpty().withMessage('Kkong duoc de trong')
    ]
})
makeUpdate({
    router: app,
    model: User,
    validators: [
        body('username').not().isEmpty().withMessage('Kkong duoc de trong')
    ]
})

const rand = (n) => {
    return Math.round(Math.random() * n)
}

const multiRand = (n, length) =>{
    return Array(length).fill(null).map( ()=> rand(n))
}

const seedData = async ()=>{

    await User.remove({})
    await Address.remove({})

    let listAddress = []

    for(let i =0; i< 100; i++){
        let address = await Address.create({
            city: i,
            street: i
        })
        listAddress.push(address)
    }

    for(let i =0; i < 10; i ++ ){
        User.create({
            username:  i,
            firstName: i % 2,
            age: i,
            address: listAddress[rand(100)],
            addresses: multiRand(100,2).map(value => listAddress[value])
        })
    }
}

seedData()

app.listen(3000, () => {
    console.log('Server listen on ' + 3000);
  })
  