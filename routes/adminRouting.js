const express =require('express');
const router=express.Router();

const tockenCheck=require('../middlewares/tockenckeck');

// user
const {getuserlist}=require('../controllers/adminuserlistcontroller');
const {getblockeduserlist}=require('../controllers/adminuserlistcontroller');
const {blockuser}=require('../controllers/adminuserlistcontroller');
const {unblockuser}=require('../controllers/adminuserlistcontroller');

// agency
const {getagencylist}=require('../controllers/adminagencylist.controller');
const {getblockedagencylist}=require('../controllers/adminagencylist.controller');
const {agencyblock}=require('../controllers/adminagencylist.controller');
const {agencyunblock}=require('../controllers/adminagencylist.controller');
const {getagencyfulldetais}=require('../controllers/adminagencylist.controller');

// booking
const {getallbooking} =require('../controllers/adminbooking.controller');

// package
const {gettingpackages} =require('../controllers/adminpackage.controller');
const {packageblock} =require('../controllers/adminpackage.controller');
const {packageunblock} =require('../controllers/adminpackage.controller');

// places
const {gettingallplaces} =require('../controllers/adminplaces.controller');

// guides
const {gettingguides} =require('../controllers/adminguides.controller');


const {requests}=require('../controllers/requests.controller');
const {approve}=require('../controllers/requests.controller');

// review agency
const {getallagencyreview}=require('../controllers/reviewandrating');


// agenncy
router.get('/getagencylist', tockenCheck, getagencylist);
router.get('/getblockedagencylist', tockenCheck, getblockedagencylist);
router.post('/agencyblock', tockenCheck, agencyblock);
router.post('/agencyunblock', tockenCheck, agencyunblock);
router.get('/getagencyfulldetais/:id', tockenCheck, getagencyfulldetais);

// user
router.get('/getuserlist', tockenCheck, getuserlist);
router.get('/getblockeduserlist', tockenCheck, getblockeduserlist);
router.post('/blockuser', tockenCheck, blockuser);
router.post('/unblockuser', tockenCheck, unblockuser);

// package
router.get('/gettingpackages', tockenCheck, gettingpackages);
router.post('/packageblock', tockenCheck, packageblock);
router.post('/packageunblock', tockenCheck, packageunblock);

// places
router.get('/gettingallplaces', tockenCheck, gettingallplaces);

// guides
router.get('/gettingguides', tockenCheck, gettingguides);

// booking
router.get('/getallbooking', tockenCheck, getallbooking);

// review
router.get('/getallagencyreview', tockenCheck, getallagencyreview);

router.get('/requests', tockenCheck, requests);
router.post('/approve', tockenCheck, approve);


module.exports=router;
