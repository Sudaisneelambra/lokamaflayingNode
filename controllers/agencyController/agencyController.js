const profile=require('../../models/mongose/agency/profileadd');
const place =require('../../models/mongose/agency/placeadd');
const guide =require('../../models/mongose/agency/guidadd');
const mongoose = require('mongoose');


module.exports={
  gettingprofile: async (req, res)=>{
    try {
      const id=req.tokens.id;
      const userId= new mongoose.Types.ObjectId(id);
      const user = await profile.findOne({userId: userId}).select('name');
      res.json({user});
    } catch (err) {
      res.json(`error occured ${err}`);
    }
  },
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
      console.log(`error is : ${err}`);
      res.status(404).json({message: err});
    }
  },
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
      console.log(`error is : ${err}`);
      res.json({message: err});
    }
  },
  gettingsingleplace: async (req, res)=>{
    try {
      console.log('suda');
      console.log(req.params.id);
      const id= new mongoose.Types.ObjectId(req.params.id);
      console.log(id);
      const singleplace = await place.findOne({_id: id});
      console.log(singleplace);
      if (singleplace) {
        console.log(singleplace);
        console.log('no issue');
        res.json({success: true, data: singleplace, message: 'successfully get the place data'});
      } else {
        console.log(singleplace);
        console.log('issue');
        res.status(404).json({message: 'failed on getting place data'});
      }
    } catch (error) {
      console.log(error);
      console.log('errorr occur');
      res.status(404).json({message: 'failed on getting place data', error: error});
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
  deletingPlace: async (req, res)=>{
    try {
      const id= new mongoose.Types.ObjectId(req.params.id);
      const deletedPlace = await place.findByIdAndDelete({_id: id});
      res.json({success: true, message: 'place deleted successfully', place: deletedPlace});
    } catch (error) {
      res.json({message: 'failed on deleting place data', error: error});
    }
  },
  addprofile: async (req, res, next)=>{
    try {
      const str=req.tokens.id;
      const objectId = new mongoose.Types.ObjectId(str);
      const {name, description, services, contactNumber1, contactNumber2,
        aboutAgency, email, openingTime, closingTime, location}=req.body;
      const parsedServices = JSON.parse(services);
      let fileURLs = [];
      if (req.files['files'] && Array.isArray(req.files['files'])) {
        fileURLs = req.files['files'].map((file) => file.location);
      }

      let logoURL = '';
      if (req.files['logo'] && req.files['logo'][0]) {
        logoURL = req.files['logo'][0].location;
      };

      await profile.updateOne(
          {userId: objectId},
          {
            $set: {
              name,
              description,
              services: {
                Tourpackage: parsedServices.Tourpackage,
                CustomerSupport: parsedServices.CustomerSupport,
                TransportationServices: parsedServices.TransportationServices,
                HotelReservationServices: parsedServices.HotelReservationServices,
                TravelConsultationandAdvice: parsedServices.TravelConsultationandAdvice,
              },
              contactNumber1,
              contactNumber2,
              aboutAgency,
              email,
              openingTime,
              closingTime,
              location,
              file_urls: fileURLs,
              logo_url: logoURL,
              userId: objectId,
            },
          }, {
            upsert: true,
          },
      );

      console.log('File uploaded:', req.file);
      res.send({data: req.file, msg: 'Successfully uploaded file'});
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send({error: 'Error uploading file'});
    }
  },
  addplace: async (req, res) => {
    try {
      const str = req.tokens.id;
      console.log('sudaiiiiiiiiiiiiiiiiiiiiis');
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
      console.log(sin);

      console.log(req.files);
      // If there are uploaded files, extract their URLs
      if (req.files) {
        fileURLs = req.files.map((file)=> file.location);
      }
      console.log(fileURLs);

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

      console.log('File uploaded:', req.file);
      res.send({
        data: req.file,
        success: true,
        message: 'Successfully uploaded place',
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).send({error: 'Error uploading file'});
    }
  },
  addguide: async (req, res)=>{
    try {
      const str = req.tokens.id;
      console.log('sudaiiiiiiiiiiiiiiiiiiiiis');
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
      console.log(prof);
      const sin = prof._id;
      console.log(sin);

      console.log(req.file);
      // If there are uploaded files, extract their URLs
      if (req.file && req.file.location) {
        fileURL = req.file.location; // Assign the file location to fileURL
        console.log(fileURL);
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

      console.log('File uploaded:', req.file);
      res.send({
        data: req.file,
        success: true,
        msg: 'Successfully uploaded file',
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).send({error: 'Error uploading file'});
    }
  },
};

