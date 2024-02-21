
// requiring express
const express =require('express');


// using express router
const router=express.Router();

// const userSignUp=require('../models/mongose/user/signup');

const tockenCheck=require('../models/middlewares/tockenckeck');

const {getSignup}=require('../controllers/signupcontroller');
const {postSignup}=require('../controllers/signupcontroller');
const {postOtpverification} = require('../controllers/signupcontroller');
const {postLogin}=require('../controllers/signupcontroller');
const {logout}=require('../controllers/signupcontroller');


const sud=require('../models/middlewares/userSignup');

router.get('/signup', getSignup);


router.post('/signup', sud, tockenCheck, postSignup );
router.post('/signup/otpverification', tockenCheck, postOtpverification );
router.post('/login', postLogin);
router.get('/logout', tockenCheck, logout);

module.exports=router;
