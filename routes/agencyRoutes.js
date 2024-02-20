const express =require('express');
const router=express.Router();

const tockenCheck=require('../models/middlewares/tockenckeck');

const upload =require('../models/multer/profileadd');
const {uploads} =require('../models/multer/placeadd');
const already =require('../models/middlewares/placeused');
const guidealredayused =require('../models/middlewares/guideused');

const {gettingprofilename} = require('../controllers/agencyController/agencyController');
const {profileget} = require('../controllers/agencyController/agencyController');

const {gettingplace} =require('../controllers/agencyController/agencyController');
const {gettingguide} =require('../controllers/agencyController/agencyController');
const {gettingpackage} =require('../controllers/agencyController/agencyController');

const {gettingsingleplace} =require('../controllers/agencyController/agencyController');
const {gettingsingleguide} =require('../controllers/agencyController/agencyController');

const {deletingPlace}=require('../controllers/agencyController/agencyController');
const {deleteguide}=require('../controllers/agencyController/agencyController');

const {editplace}=require('../controllers/agencyController/agencyController');
const {editguide}=require('../controllers/agencyController/agencyController');

const {addprofile}= require('../controllers/agencyController/agencyController');
const {addplace} =require('../controllers/agencyController/agencyController');
const {addguide} =require('../controllers/agencyController/agencyController');
const {packageadd} =require('../controllers/agencyController/agencyController');
const {getsinglepackage} =require('../controllers/agencyController/agencyController');


router.get('/profilenameget', tockenCheck, gettingprofilename);
router.get('/profileget', tockenCheck, profileget);
router.get('/getplace', tockenCheck, gettingplace);
router.get('/getguide', tockenCheck, gettingguide);
router.get('/getpackage', tockenCheck, gettingpackage);
router.get('/getsingleplace/:id', tockenCheck, gettingsingleplace);
router.get('/getsingleguide/:id', tockenCheck, gettingsingleguide);
router.get('/getsinglepackage/:id', tockenCheck, getsinglepackage);

router.get('/gettoken', tockenCheck);


router.delete('/deleteplace/:id', tockenCheck, deletingPlace);
router.delete('/deleteguide/:id', tockenCheck, deleteguide);
router.put('/editplace', tockenCheck, uploads.array('images', 5), editplace);
router.put('/editguide', tockenCheck, uploads.single('guideimages'), editguide);


router.post('/profileadd', tockenCheck, upload.fields([{name: 'files'}, {name: 'logo'}]), addprofile);
router.post('/placeadd', tockenCheck, uploads.array('images', 5), already, addplace);
router.post('/guideadd', tockenCheck, uploads.single('guideimages'), guidealredayused, addguide);
router.post('/packageadd', tockenCheck, packageadd);


module.exports=router;
