const guide=require('../mongose/agency/guidadd');
const profile=require('../mongose/agency/profileadd');
require('dotenv').config();
const {DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {s3Client} = require('../multer/placeadd');


const guidealredayused = async (req, res, next)=>{
  const id =req.tokens.id;
  const {guidename} = req.body;
  const prof = await profile.findOne({userId: id});
  const guideused= await guide.find({agencyid: prof._id});


  if (Array.isArray(guideused)) {
    const sin = guideused.filter((m)=>{
      return m.guidename == guidename;
    });
    if (sin.length > 0) {
      const key = req.file.key; // Assuming multer-s3 provides the file key

      // Delete the file from S3 bucket
      const params = {
        Bucket: process.env.MYBUCKET, // Your S3 bucket name
        Key: key, // The key of the file to delete
      };

      await s3Client.send(new DeleteObjectCommand(params));

      // Send error response indicating guide name already used
      return res.json({message: 'Guide already added'});
    } else {
      next();
    }
  }
};

module.exports=guidealredayused;
