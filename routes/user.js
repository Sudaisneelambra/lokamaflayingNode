// requiring express
const express =require('express')

// using express router
const router=express.Router()

// requiring mongoose
const mongoose=require('mongoose')

// requiring dotenv
require('dotenv').config()

// requiring mongodb url

const DB_URL=process.env.DB_connection

// connecting mongodb

mongoose.connect(DB_URL)

router.get('/signup',()=>{
console.log("sudais neelambra");
})

module.exports=router