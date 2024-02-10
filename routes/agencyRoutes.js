const express =require('express');
const router=express.Router();


require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const {S3Client} = require('@aws-sdk/client-s3');

const myBucket = process.env.MYBUCKET;

const region = process.env.REGION;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: myBucket,
    metadata: function(req, file, cb) {
      cb(null, {fieldName: file.originalname});
    },
    key: function(req, file, cb) {
      console.log(file.originalname);
      console.log('linnn');
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

const {addprofile}= require('../controllers/agencyController/agencyController');

router.post('/profileadd', upload.fields([{name: 'files'}, {name: 'logo'}]), addprofile);

module.exports=router;
