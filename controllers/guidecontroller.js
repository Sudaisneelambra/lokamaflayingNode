/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const guide =require('../models/guidadd');
const profile=require('../models/profileadd');
const package=require('../models/package');

module.exports={
  gettingguide: async (req, res)=>{
    try {
      const id= new mongoose.Types.ObjectId(req.tokens.id);
      const prof= await profile.findOne({userId: id});
      const guid = await guide.find({agencyid: prof._id}).select('guidename aboutguide guideurl');
      if (guid) {
        res.json({
          success: true,
          message: 'all guide data getted',
          data: guid,
        });
      } else {
        res.json({
          message: 'getting guide failed',
        });
      }
    } catch (err) {
      res.json({message: err});
    }
  },
  gettingsingleguide: async (req, res)=>{
    try {
      const id= new mongoose.Types.ObjectId(req.params.id);
      const singleguide = await guide.findOne({_id: id});
      res.json({success: true, data: singleguide, message: 'successfully get the guide data'});
    } catch (error) {
      res.json({message: 'failed on getting guid data', error: error});
    }
  },
  editguide: async (req, res) =>{
    try {
      const guideid= new mongoose.Types.ObjectId(req.body.id);
      const objectId = new mongoose.Types.ObjectId(req.tokens.id);
      const {
        guidename,
        aboutguide,
        experience,
      } = req.body;
      // If there are uploaded files, extract their URLs
      if (req.file && req.file.location) {
        fileURL = req.file.location; // Assign the file location to fileURL
      }
      const prof = await profile.findOne({
        userId: objectId,
      });
      const sin = prof._id;
      const updated= await guide.updateOne({_id: guideid}, {
        $set: {
          guidename,
          aboutguide,
          experience,
          guideurl: fileURL,
          agencyid: sin,
        }});
      res.send({
        data: req.file,
        success: true,
        message: 'Successfully updated guide',
      });
    } catch (err) {
      res.status(400).send({error: 'Error uploading file'});
    }
  },
  deleteguide: async (req, res) =>{
    try {
      const id= new mongoose.Types.ObjectId(req.params.id);
      const deletedguide = await guide.findByIdAndDelete({_id: id});
      res.json({success: true, message: 'guide deleted successfully', guide: deletedguide});
    } catch (error) {
      res.json({message: 'failed on deleting guide data', error: error});
    }
  },
  addguide: async (req, res)=>{
    try {
      const str = req.tokens.id;
      const objectId = new mongoose.Types.ObjectId(str);
      const {
        guidename,
        aboutguide,
        experience,
      } = req.body;

      // Declare fileURLs variable
      let fileURL = '';

      // Fetch user profile
      const prof = await profile.findOne({
        userId: objectId,
      });
      const sin = prof._id;
      // If there are uploaded files, extract their URLs
      if (req.file && req.file.location) {
        fileURL = req.file.location; // Assign the file location to fileURL
      }

      // Update or insert place data
      const newguide = new guide({
        guidename,
        aboutguide,
        experience,
        guideurl: fileURL,
        agencyid: sin,
      });

      await newguide.save();
      res.send({
        data: req.file,
        success: true,
        msg: 'Successfully uploaded file',
      });
    } catch (err) {
      res.status(500).send({error: 'Error uploading file'});
    }
  },
  conformations: async (req, res)=> {
    try {
      const str = req.tokens.id;
      const objectId = new mongoose.Types.ObjectId(str);
      const prof = await profile.findOne({
        userId: objectId,
      });
      const pac = await package.find({agencyid: prof._id});
      const guideIds = pac.flatMap((item) => item.guid.map((guid) => guid.id));
      const id = req.params.id;
      const stringIdsArray = guideIds.map((id) => id.toString());
      const find= stringIdsArray.find((m)=>{
        return m==id;
      });
      if (find) {
        res.json({
          strict: true,
          message: 'guid included in package',
        });
      } else {
        res.json({
          strict: false,
          message: 'guid exclude in package',
        });
      }
    } catch (error) {

    }
  },
  deletepackageguide: async (req, res)=>{
    try {
      const id= req.params.id;
      const str = req.tokens.id;
      const userid = new mongoose.Types.ObjectId(str);
      const prof = await profile.findOne({userId: userid});
      const pac = await package.find({agencyid: prof._id});
      pac.forEach(async (pkg) => {
        const index = pkg.guid.findIndex((guide) =>{
          return guide.id.toString() == id;
        });
        if (index !== -1) {
          pkg.guid.splice(index, 1);
          await pkg.save();
          const deletedguide = await guide.findByIdAndDelete({_id: new mongoose.Types.ObjectId(id)});
          res.json({success: true, message: 'place deleted successfully', place: deletedguide});
        }
      });
    } catch (err) {
      res.json({message: 'failed on deleting place data', error: err});
    }
  },
};
