/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const place =require('../models/mongose/agency/placeadd');
const profile=require('../models/mongose/agency/profileadd');
const package =require('../models/mongose/agency/package');


module.exports ={
  gettingplace: async (req, res)=>{
    try {
      const id= new mongoose.Types.ObjectId(req.tokens.id);
      const prof= await profile.findOne({userId: id});
      const plac = await place.find({agencyid: prof._id}).select('_id placeName placeDescription placeurl');
      if (plac) {
        res.json({
          success: true,
          message: 'all place data getted',
          data: plac,
        });
      } else {
        res.status(404).json({
          message: 'getting profile failed',
        });
      }
    } catch (err) {
      res.status(404).json({message: err});
    }
  },
  editplace: async (req, res)=>{
    try {
      const placeid= new mongoose.Types.ObjectId(req.body.id);
      const objectId = new mongoose.Types.ObjectId(req.tokens.id);
      const {
        placeName,
        placeDescription,
        openingTime,
        closingTime,
        entryFee,
        location,
      } = req.body;

      // Declare fileURLs variable
      let fileURLs = [];
      if (req.files) {
        fileURLs = req.files.map((file)=> file.location);
      }
      const prof = await profile.findOne({
        userId: objectId,
      });
      const sin = prof._id;
      const updated= await place.updateOne({_id: placeid}, {
        $set: {
          placeName,
          placeDescription,
          openingTime,
          closingTime,
          entryFee,
          location,
          placeurl: fileURLs,
          agencyid: sin,
        }});
      res.send({
        data: req.file,
        success: true,
        message: 'Successfully updated place',
      });
    } catch (err) {
      res.status(500).send({error: 'Error uploading file'});
    }
  },
  deletingPlace: async (req, res)=>{
    try {
      const id= new mongoose.Types.ObjectId(req.params.id);
      const deletedPlace = await place.findByIdAndDelete({_id: id});
      res.json({success: true, message: 'place deleted successfully', place: deletedPlace});
    } catch (error) {
      res.json({message: 'failed on deleting place data', error: error});
    }
  },
  addplace: async (req, res) => {
    try {
      const str = req.tokens.id;
      const objectId = new mongoose.Types.ObjectId(str);
      const {
        placeName,
        placeDescription,
        openingTime,
        closingTime,
        entryFee,
        location,
      } = req.body;

      // Declare fileURLs variable
      let fileURLs = [];

      // Fetch user profile
      const prof = await profile.findOne({
        userId: objectId,
      });
      const sin = prof._id;
      // If there are uploaded files, extract their URLs
      if (req.files) {
        fileURLs = req.files.map((file)=> file.location);
      }

      // Update or insert place data
      const newPlace = new place({
        placeName,
        placeDescription,
        openingTime,
        closingTime,
        entryFee,
        location,
        placeurl: fileURLs,
        agencyid: sin,
      });

      await newPlace.save();
      res.send({
        data: req.file,
        success: true,
        message: 'Successfully uploaded place',
      });
    } catch (err) {
      res.status(500).send({error: 'Error uploading file'});
    }
  },
  gettingsingleplace: async (req, res)=>{
    try {
      const id= new mongoose.Types.ObjectId(req.params.id);
      const singleplace = await place.findOne({_id: id});
      if (singleplace) {
        res.json({success: true, data: singleplace, message: 'successfully get the place data'});
      } else {
        res.status(404).json({message: 'failed on getting place data'});
      }
    } catch (error) {
      res.status(404).json({message: 'failed on getting place data', error: error});
    }
  },
  conformation: async (req, res)=> {
    try {
      const str = req.tokens.id;
      const objectId = new mongoose.Types.ObjectId(str);
      const prof = await profile.findOne({
        userId: objectId,
      });
      const pac = await package.find({agencyid: prof._id});
      console.log(pac);
      const placeIds = pac.flatMap((item) => item.places.map((place) => place.placeid));
      console.log(placeIds);
      console.log('sudais');
      const id = req.params.id;
      console.log(id);
      console.log(placeIds);
      const stringIdsArray = placeIds.map((id) => id.toString());
      console.log(stringIdsArray);
      const find= stringIdsArray.find((m)=>{
        return m==id;
      });
      console.log(find);
      if (find) {
        res.json({
          strict: true,
          message: 'place included in package',
        });
      } else {
        res.json({
          strict: false,
          message: 'place exclude in package',
        });
      }
    } catch (error) {

    }
  },
  packageplacedeleting: (req, res)=> {
    const id= new mongoose.Types.ObjectId(req.params.id);
    
  },
};
