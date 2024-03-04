
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
const {username}=require('../controllers/userprofile.controller');

// package
const {getpackages}=require('../controllers/userpackage.controller');
const {getsinglepackage}=require('../controllers/userpackage.controller');
const {getpackage}=require('../controllers/userpackage.controller');

// places
const {getplaces}=require('../controllers/userplace.controller');
const {getsingleplace}=require('../controllers/userplace.controller');
const {getplace}=require('../controllers/userplace.controller');


// agency
const {getagencies}=require('../controllers/useragency.controller');
const {getingsingleagency}=require('../controllers/useragency.controller');


// wishlist
const {addtowishlist}=require('../controllers/wishlistController');
const {getwishlist}=require('../controllers/wishlistController');
const {removewishlist}=require('../controllers/wishlistController');

// payment and book
const {creatingorder}=require('../controllers/bookandpayment.controller');
const {bookingpayment}=require('../controllers/bookandpayment.controller');
const {checkingalraedybooked}=require('../controllers/bookandpayment.controller');
const {bookingdetails}=require('../controllers/bookandpayment.controller');

// review and rating
const {reviewandrating}=require('../controllers/reviewandrating');
const {gettingpagereview}=require('../controllers/reviewandrating');

// userguide
const {getguide}=require('../controllers/userguide.controller');

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
router.get('/username', tockenCheck, username);

// package
router.get('/getpackages', tockenCheck, getpackages);
router.get('/getsinglepackage/:id', tockenCheck, getsinglepackage);
router.get('/getpackage/:id', tockenCheck, getpackage);


// places
router.get('/getplaces', tockenCheck, getplaces);
router.get('/getsingleplace/:id', tockenCheck, getsingleplace);
router.get('/getplace/:id', tockenCheck, getplace);

// agencies
router.get('/getagencies', tockenCheck, getagencies);
router.get('/getingsingleagency/:id', tockenCheck, getingsingleagency);

// wishlist
router.post('/addtowishlist', tockenCheck, addtowishlist);
router.get('/getwishlist', tockenCheck, getwishlist);
router.delete('/removewishlist/:id', tockenCheck, removewishlist);

// order payment
router.post('/create-order', tockenCheck, creatingorder);
router.post('/bookingpayment', tockenCheck, bookingpayment);
router.get('/checkingalraedybooked/:id', tockenCheck, checkingalraedybooked);
router.get('/bookingdetails', tockenCheck, bookingdetails);


// agency review
router.post('/reviewandrating', tockenCheck, reviewandrating);
router.get('/gettingpagereview', tockenCheck, gettingpagereview);

// guid user
router.get('/getguide', tockenCheck, getguide);

module.exports=router;
