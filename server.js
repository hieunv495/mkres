const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')

require('./abstract_crud').setMongoose(mongoose)


const {body} = require('express-validator/check')

var app = express()

let mongodb = mongoose.connect('mongodb://mongo:27017/mkres')

const User = require('./models/User')
const Address = require('./models/Address')
const {makeFind,makeFindById,makeDelete,makeCreate,makeUpdate} = require('./abstract_crud')


// BODY
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

let router = express.Router()

router.get('/test',(req,res)=>{
    Address.find({}).populate('users').then(data =>{
        res.json(data)
    })
})

makeFind({
    router,
    model: Address
})

app.use('/address',router)


makeFind({
    router: app,
    model: User,
    defaultParams: {
        // paginate: false,
        // limit: 2,
        // select: 'username',
        // withId: true,
        populate: 'address addresses'
    }
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
    ],
    defaultParams: {
        populate: 'address'
    }
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
        await User.create({
            username:  i,
            firstName: i % 2,
            birthday: {
                date: i,
                month: i,
                year: i,
                address: listAddress[rand(100)]
            },
            birthdays: Array(5).fill(null).map(j => ({
                date: i + j,
                month: i + j,
                year: i + j,
                address: listAddress[rand(100)]
            })),
            age: i,
            address: listAddress[rand(100)],
            addresses: multiRand(100,2).map(value => listAddress[value])
        })
    }

    let users = await User.find().populate(['address',{path: 'addresses',select: 'city'}])

}

seedData()

app.listen(80, () => {
    console.log('Server listen on ' + 80);
  })
  