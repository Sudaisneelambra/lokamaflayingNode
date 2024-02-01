
// requiring express
const express =require('express');


// using express router
const router=express.Router();

// const userSignUp=require('../models/mongose/user/signup');

const {getSignup}=require('../controllers/userController/signupController');
const {postSignup}=require('../controllers/userController/signupController');


router.get('/signup', getSignup);

router.post('/signup', postSignup );

module.exports=router;
