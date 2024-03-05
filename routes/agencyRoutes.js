const express =require('express');
const router=express.Router();

const tockenCheck=require('../middlewares/tockenckeck');

const upload =require('../utils/profileadd');
const {uploads} =require('../utils/placeadd');
const already =require('../middlewares/placeused');
const guidealredayused =require('../middlewares/guideused');


// guide controller
const {gettingguide} =require('../controllers/guidecontroller');
const {gettingsingleguide} =require('../controllers/guidecontroller');
const {editguide}=require('../controllers/guidecontroller');
const {deleteguide}=require('../controllers/guidecontroller');
const {addguide} =require('../controllers/guidecontroller');
const {conformations} =require('../controllers/guidecontroller');
const {deletepackageguide} =require('../controllers/guidecontroller');


// place controller
const {gettingplace} =require('../controllers/placecontroller');
const {editplace}=require('../controllers/placecontroller');
const {deletingPlace}=require('../controllers/placecontroller');
const {addplace} =require('../controllers/placecontroller');
const {gettingsingleplace} =require('../controllers/placecontroller');
const {conformation} =require('../controllers/placecontroller');
const {packageplacedeleting} =require('../controllers/placecontroller');


// agencyprofile controller
const {gettingprofilename} = require('../controllers/agencyprofilecontroller');
const {profileget} = require('../controllers/agencyprofilecontroller');
const {addprofile}= require('../controllers/agencyprofilecontroller');
const {profileckeck}= require('../controllers/agencyprofilecontroller');


// package controller
const {gettingpackage} =require('../controllers/packagecontroller');
const {packageadd} =require('../controllers/packagecontroller');
const {getsinglepackage} =require('../controllers/packagecontroller');
const {deletepackage} =require('../controllers/packagecontroller');
const {editpackage} =require('../controllers/packagecontroller');

// booking
const {getbooking} =require('../controllers/bookandpayment.controller');

// review
const {getreview} =require('../controllers/reviewandrating');


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
router.get('/confirmation/:id', tockenCheck, conformation);
router.delete('/deletepackageplace/:id', tockenCheck, packageplacedeleting);

// booking
router.get('/getbooking', tockenCheck, getbooking);

// review
router.get('/getreview', tockenCheck, getreview);


// guide
router.get('/getguide', tockenCheck, gettingguide);
router.get('/getsingleguide/:id', tockenCheck, gettingsingleguide);
router.put('/editguide', tockenCheck, uploads.single('guideimages'), editguide);
router.delete('/deleteguide/:id', tockenCheck, deleteguide);
router.post('/guideadd', tockenCheck, uploads.single('guideimages'), guidealredayused, addguide);
router.get('/confirmationguid/:id', tockenCheck, conformations);
router.delete('/deletepackageguide/:id', tockenCheck, deletepackageguide);

router.get('/profileckeck', tockenCheck, profileckeck);


router.get('/gettoken', tockenCheck);

module.exports=router;
