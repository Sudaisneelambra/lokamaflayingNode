
// requiring express
const express =require('express');


// using express router
const router=express.Router();

// const userSignUp=require('../models/mongose/user/signup');

const tockenCheck=require('../middlewares/tockenckeck');

const {getSignup}=require('../controllers/signupcontroller');
const {postSignup}=require('../controllers/signupcontroller');
const {postOtpverification} = require('../controllers/signupcontroller');
const {postLogin}=require('../controllers/signupcontroller');
const {logout}=require('../controllers/signupcontroller');


// profile
const {profileadd}=require('../controllers/userprofile.controller');
const {getprofile}=require('../controllers/userprofile.controller');
const {getprof}=require('../controllers/userprofile.controller');

// package
const {getpackages}=require('../controllers/userpackage.controller');

// places
const {getplaces}=require('../controllers/userplace.controller');
const {getsingleplace}=require('../controllers/userplace.controller');


// agency
const {getagencies}=require('../controllers/useragency.controller');

const sud=require('../middlewares/userSignup');

router.get('/signup', getSignup);


router.post('/signup', sud, postSignup );
router.post('/signup/otpverification', postOtpverification );
router.post('/login', postLogin);
router.get('/logout', tockenCheck, logout);

// profile
router.post('/profileuser', tockenCheck, profileadd);
router.get('/getprofile', tockenCheck, getprofile);
router.get('/getprof/:id', tockenCheck, getprof);

// package
router.get('/getpackages', tockenCheck, getpackages);

// places
router.get('/getplaces', tockenCheck, getplaces);
router.get('/getsingleplace/:id', tockenCheck, getsingleplace);


// agencies
router.get('/getagencies', tockenCheck, getagencies);

module.exports=router;
