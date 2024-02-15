const express =require('express');
const router=express.Router();

const tockenCheck=require('../models/middlewares/tockenckeck');

const upload =require('../models/multer/profileadd');
const {uploads} =require('../models/multer/placeadd');
const already =require('../models/middlewares/placeused');
const guidealredayused =require('../models/middlewares/guideused');

const {addprofile}= require('../controllers/agencyController/agencyController');
const {gettingprofile} = require('../controllers/agencyController/agencyController');
const {addplace} =require('../controllers/agencyController/agencyController');
const {addguide} =require('../controllers/agencyController/agencyController');


router.get('/profileget', tockenCheck, gettingprofile);

router.post('/profileadd', tockenCheck, upload.fields([{name: 'files'}, {name: 'logo'}]), addprofile);
router.post('/placeadd', tockenCheck, uploads.array('images', 5), already, addplace);
router.post('/guideadd', tockenCheck, uploads.single('guideimages'), guidealredayused, addguide);


module.exports=router;
