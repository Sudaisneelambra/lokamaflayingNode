const express =require('express');
const router=express.Router();

const tockenCheck=require('../models/middlewares/tockenckeck');

const {getuserlist}=require('../controllers/adminuserlistcontroller');
const {getblockeduserlist}=require('../controllers/adminuserlistcontroller');
const {blockuser}=require('../controllers/adminuserlistcontroller');
const {unblockuser}=require('../controllers/adminuserlistcontroller');


const {getagencylist}=require('../controllers/adminagencylist.controller');
const {getblockedagencylist}=require('../controllers/adminagencylist.controller');
const {agencyblock}=require('../controllers/adminagencylist.controller');
const {agencyunblock}=require('../controllers/adminagencylist.controller');
const {getagencyfulldetais}=require('../controllers/adminagencylist.controller');


const {requests}=require('../controllers/requests.controller');
const {approve}=require('../controllers/requests.controller');


router.get('/getagencylist', tockenCheck, getagencylist);
router.get('/getblockedagencylist', tockenCheck, getblockedagencylist);
router.post('/agencyblock', tockenCheck, agencyblock);
router.post('/agencyunblock', tockenCheck, agencyunblock);
router.get('/getagencyfulldetais/:id', tockenCheck, getagencyfulldetais);


router.get('/getuserlist', tockenCheck, getuserlist);
router.get('/getblockeduserlist', tockenCheck, getblockeduserlist);
router.post('/blockuser', tockenCheck, blockuser);
router.post('/unblockuser', tockenCheck, unblockuser);


router.get('/requests', tockenCheck, requests);
router.post('/approve', tockenCheck, approve);


module.exports=router;
