
const express=require('express');
const app=express();
const userRout=require('./routes/user');
const agencyRoutes=require('./routes/agencyRoutes');

require('dotenv').config();

// requiring cors
const cors = require('cors');

// requiring mongoose
const mongoose=require('mongoose');

const session = require('express-session');
app.use(session({
  secret: process.env.SESSIONSECRETKEY,
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 30 * 60 * 1000},
}));


// requiring mongodb url
const DB_URL=process.env.DB_connection;

// connecting mongodb
mongoose.connect(DB_URL).then((res)=>{
  app.listen(3000, ()=>{
    console.log('server running on 3000 port');
  });
})
    .catch((err)=>{
      console.log('server connection failed');
    });

// using cors
app.use(cors());

// requiring body parser
const bodyParser = require('body-parser');

// use parser
app.use(bodyParser.json());

app.use('/user', userRout);
app.use('/agency', agencyRoutes);


