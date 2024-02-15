const place=require('../mongose/agency/placeadd');
const profile=require('../mongose/agency/profileadd');
require('dotenv').config();
const {DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {s3Client} = require('../multer/placeadd');


const already= async (req, res, next)=>{
  const id=req.tokens.id;
  const {placeName} = req.body;
  const prof = await profile.findOne({userId: id});
  const placeused= await place.find({agencyid: prof._id});
  if (Array.isArray(placeused)) {
    const sin = placeused.filter((m)=>{
      return m.placeName == placeName;
    });
    if (sin.length>0) {
      const filesToDelete = req.files.map((file) => file.key); // Assuming multer-s3 provides the file key
      const deletePromises = filesToDelete.map((key) => {
        const params = {
          Bucket: process.env.MYBUCKET,
          Key: key,
        };
        return s3Client.send(new DeleteObjectCommand(params));
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      // Send error response indicating guide name already used
      return res.json({message: 'place already added'});
    } else {
      next();
    }
  }
};
module.exports = already;
