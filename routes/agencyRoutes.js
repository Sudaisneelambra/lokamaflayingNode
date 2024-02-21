const express =require('express');
const router=express.Router();

const tockenCheck=require('../models/middlewares/tockenckeck');

const upload =require('../models/multer/profileadd');
const {uploads} =require('../models/multer/placeadd');
const already =require('../models/middlewares/placeused');
const guidealredayused =require('../models/middlewares/guideused');


// guide controller
const {gettingguide} =require('../controllers/guidecontroller');
const {gettingsingleguide} =require('../controllers/guidecontroller');
const {editguide}=require('../controllers/guidecontroller');
const {deleteguide}=require('../controllers/guidecontroller');
const {addguide} =require('../controllers/guidecontroller');

// place controller
const {gettingplace} =require('../controllers/placecontroller');
const {editplace}=require('../controllers/placecontroller');
const {deletingPlace}=require('../controllers/placecontroller');
const {addplace} =require('../controllers/placecontroller');
const {gettingsingleplace} =require('../controllers/placecontroller');

// agencyprofile controller
const {gettingprofilename} = require('../controllers/agencyprofilecontroller');
const {profileget} = require('../controllers/agencyprofilecontroller');
const {addprofile}= require('../controllers/agencyprofilecontroller');

// package controller
const {gettingpackage} =require('../controllers/packagecontroller');
const {packageadd} =require('../controllers/packagecontroller');
const {getsinglepackage} =require('../controllers/packagecontroller');
const {deletepackage} =require('../controllers/packagecontroller');
const {editpackage} =require('../controllers/packagecontroller');


// profile
router.get('/profilenameget', tockenCheck, gettingprofilename);
router.get('/profileget', tockenCheck, profileget);
router.post('/profileadd', tockenCheck, upload.fields([{name: 'files'}, {name: 'logo'}]), addprofile);

// package
router.get('/getpackage', tockenCheck, gettingpackage);
router.post('/packageadd', tockenCheck, packageadd);
router.get('/getsinglepackage/:id', tockenCheck, getsinglepackage);
router.delete('/deletepackage/:id', tockenCheck, deletepackage);
router.put('/editpackage', tockenCheck, editpackage);


// place
router.get('/getplace', tockenCheck, gettingplace);
router.put('/editplace', tockenCheck, uploads.array('images', 5), editplace);
router.delete('/deleteplace/:id', tockenCheck, deletingPlace);
router.post('/placeadd', tockenCheck, uploads.array('images', 5), already, addplace);
router.get('/getsingleplace/:id', tockenCheck, gettingsingleplace);

// guide
router.get('/getguide', tockenCheck, gettingguide);
router.get('/getsingleguide/:id', tockenCheck, gettingsingleguide);
router.put('/editguide', tockenCheck, uploads.single('guideimages'), editguide);
router.delete('/deleteguide/:id', tockenCheck, deleteguide);
router.post('/guideadd', tockenCheck, uploads.single('guideimages'), guidealredayused, addguide);


router.get('/gettoken', tockenCheck);

module.exports=router;
