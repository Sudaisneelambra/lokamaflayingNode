const express= require('express')
const app=express()
const userRout=require('./routes/user')

app.use('/user',userRout)


app.listen(4200,()=>{
    console.log("server running on 4200 port");
})
