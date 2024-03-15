const mongoose = require('mongoose');
const profile=require('../models/profileadd');


module.exports={
  gettingprofilename: async (req, res)=>{
    try {
      const id=req.tokens.id;
      const userId= new mongoose.Types.ObjectId(id);
      const user = await profile.findOne({userId: userId}).select('name');
      res.json({user});
    } catch (err) {
      res.json(`error occured ${err}`);
    }
  },
  profileget: async (req, res)=> {
    try {
      const id=req.tokens.id;
      const userId= new mongoose.Types.ObjectId(id);
      const user = await profile.findOne({userId: userId});
      res.json({user});
    } catch (err) {
      res.json(`error occured ${err}`);
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
      res.send({data: req.file, msg: 'Successfully uploaded file'});
    } catch (error) {
      res.status(500).send({error: 'Error uploading file'});
    }
  },
  profileckeck: async (req, res) =>{
    const id = req.tokens.id;
    const prof= await profile.findOne({userId: new mongoose.Types.ObjectId(id)});
    if (prof) {
      res.json({profileadd: true});
    } else {
      res.json({profileadd: false});
    }
  },
};
