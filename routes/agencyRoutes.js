const express =require('express');
const router=express.Router();

const tockenCheck=require('../models/middlewares/tockenckeck');

const upload =require('../models/multer/profileadd');
const {uploads} =require('../models/multer/placeadd');
const already =require('../models/middlewares/placeused');
const guidealredayused =require('../models/middlewares/guideused');

const {gettingprofile} = require('../controllers/agencyController/agencyController');
const {gettingplace} =require('../controllers/agencyController/agencyController');
const {gettingguide} =require('../controllers/agencyController/agencyController');
const {gettingsingleplace} =require('../controllers/agencyController/agencyController');
const {gettingsingleguide} =require('../controllers/agencyController/agencyController');

const {deletingPlace}=require('../controllers/agencyController/agencyController');

const {addprofile}= require('../controllers/agencyController/agencyController');
const {addplace} =require('../controllers/agencyController/agencyController');
const {addguide} =require('../controllers/agencyController/agencyController');


router.get('/profileget', tockenCheck, gettingprofile);
router.get('/getplace', tockenCheck, gettingplace);
router.get('/getguide', tockenCheck, gettingguide);
router.get('/getsingleplace/:id', tockenCheck, gettingsingleplace);
router.get('/getsingleguide/:id', tockenCheck, gettingsingleguide);

router.delete('/deleteplace/:id', tockenCheck, deletingPlace);


router.post('/profileadd', tockenCheck, upload.fields([{name: 'files'}, {name: 'logo'}]), addprofile);
router.post('/placeadd', tockenCheck, uploads.array('images', 5), already, addplace);
router.post('/guideadd', tockenCheck, uploads.single('guideimages'), guidealredayused, addguide);


module.exports=router;
