const mongoose=require('mongoose')

const signupSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isUser:{
        type:Boolean,
        default:
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})

