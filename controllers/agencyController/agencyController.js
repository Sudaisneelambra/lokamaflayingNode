const profile=require('../../models/mongose/agency/profileadd');
const mongoose = require('mongoose');


module.exports={
  addprofile: async (req, res, next)=>{
    try {
      const str=req.tokens.id;
      const objectId = new mongoose.Types.ObjectId(str);
      console.log(objectId);
      console.log(req.body);
      const {name, description, services, contactNumber1, contactNumber2,
        aboutAgency, email, openingTime, closingTime, location}=req.body;
      console.log(services);
      const parsedServices = JSON.parse(services);
      console.log(parsedServices.Tourpackage);
      let fileURLs = [];
      if (req.files['files'] && Array.isArray(req.files['files'])) {
        console.log('puliyan');
        console.log('--------------------------------------------------------------------------------');
        fileURLs = req.files['files'].map((file) => file.location);
      }

      let logoURL = '';
      if (req.files['logo'] && req.files['logo'][0]) {
        console.log('nabatty');
        logoURL = req.files['logo'][0].location;
      }

      const profileData= new profile({
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
      });

      await profileData.save();

      console.log('File uploaded:', req.file);
      res.send({data: req.file, msg: 'Successfully uploaded file'});
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send({error: 'Error uploading file'});
    }
  },
};
