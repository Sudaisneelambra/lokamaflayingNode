
// requiring express
const express =require('express');


// using express router
const router=express.Router();

// const userSignUp=require('../models/mongose/user/signup');

const {getSignup}=require('../controllers/userController/signupController');
const {postSignup}=require('../controllers/userController/signupController');
const {postOtpverification}=require('../controllers/userController/signupController');
const {postLogin}=require('../controllers/userController/signupController');

const sud=require('../models/middlewares/userSignup');

router.get('/signup', getSignup);

router.post('/signup', sud, postSignup );
router.post('/signup/otpverification', postOtpverification );
router.post('/login', postLogin);

module.exports=router;
