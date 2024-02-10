
const express=require('express');
const app=express();
const userRout=require('./routes/user');
const agencyRoutes=require('./routes/agencyRoutes');

// requiring cors
const cors = require('cors');

// requiring mongoose
const mongoose=require('mongoose');

// requiring dotenv
require('dotenv').config();

// requiring mongodb url
const DB_URL=process.env.DB_connection;

// connecting mongodb
mongoose.connect(DB_URL);

// using cors
app.use(cors());

// requiring body parser
const bodyParser = require('body-parser');

// use parser
app.use(bodyParser.json());

app.use('/user', userRout);
app.use('/agency', agencyRoutes);


app.listen(3000, ()=>{
  console.log('server running on 3000 port');
});
