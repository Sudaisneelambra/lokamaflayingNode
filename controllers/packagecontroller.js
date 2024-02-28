const mongoose = require('mongoose');
const profile=require('../models/profileadd');
const package =require('../models/package');
const place =require('../models/placeadd');
const guide = require('../models/guidadd');


module.exports={
  gettingpackage: async (req, res) =>{
    try {
      const id= new mongoose.Types.ObjectId(req.tokens.id);
      const prof= await profile.findOne({userId: id});
      // const pack = await package.find({agencyid: prof._id});
      const look = await package.aggregate([{$match: {agencyid: prof._id}}, {$lookup: {from: 'places',
        localField: 'places.placeid', foreignField: '_id', as: 'placefulldetails'}}]);
      if (look) {
        res.json({
          success: true,
          message: 'all package data getted',
          data: look,
        });
      } else {
        res.json({
          message: 'getting package failed',
        });
      }
    } catch (err) {
      res.json({message: err});
    }
  },
  packageadd: async (req, res)=>{
    try {
      const {mainform, places, guid} = req.body;
      const {packageName, aboutPackage, packagePrice, fecilities,
        startDate, endDate, offer, offerRate, maximumCapacity,
        availableSlot}=mainform;
      const str = new mongoose.Types.ObjectId(req.tokens.id);
      const prof= await profile.findOne({userId: str});

      const newPlaces = places.map((place) => ({
        placeid: new mongoose.Types.ObjectId(place.placeId),
        placename: place.placename,
        arrivalDate: place.arrivalDate,
        arrivingtime: place.arrivingtime,
        returnDate: place.returnDate,
        returntime: place.returntime,
      }));

      const newguides = guid.map((guide) => ({
        id: new mongoose.Types.ObjectId(guide.id),
        name: guide.name,
      }));

      const newpackage= new package({
        packageName,
        aboutPackage,
        packagePrice,
        fecilities: {
          Transportation: fecilities.Transportation,
          Accommodation: fecilities.Accommodation,
          Meals: fecilities.Meals,
          ProfessionalGuides: fecilities.ProfessionalGuides,
          LanguageSupport: fecilities.LanguageSupport,
          TravelInsurance: fecilities.TravelInsurance,
          CustomerSupport: fecilities.CustomerSupport,
        },
        startDate,
        endDate,
        offer,
        offerRate,
        maximumCapacity,
        availableSlot,
        places: newPlaces,
        guid: newguides,
        agencyid: prof._id,
      });
      const added= await newpackage.save();
      if (added) {
        res.json({success: true, message: 'package added succes fully'});
      } else {
        res.status(404).json({success: false, message: 'package added failed'});
      }
    } catch (error) {
      res.status(404).json({message: `failed to add package and error is : ${error}`});
    }
  },
  getsinglepackage: async (req, res)=>{
    try {
      const packageid= new mongoose.Types.ObjectId(req.params.id);
      const pack= await package.findOne({_id: packageid});
      if (pack) {
        console.log(pack);
        const placeIds = pack.places.map((place) => place.placeid);
        const guideIds = pack.guid.map((guid) => guid.id);
        // Assuming you have a Place model
        const places = await place.find({_id: {$in: placeIds}});
        const gyd = await guide.find({_id: {$in: guideIds}});

        res.json({
          success: true,
          message: 'all package data getted',
          package: pack,
          place: places,
          guide: gyd,
        });
      } else {
        res.json({
          message: 'getting package failed',
          success: false,
        });
      }
    } catch (err) {
      res.json({message: err});
    }
  },
  deletepackage: async (req, res)=>{
    try {
      const id= new mongoose.Types.ObjectId(req.params.id);
      const deletedPackage = await package.findByIdAndDelete({_id: id});
      res.json({success: true, message: 'package deleted successfully', package: deletedPackage});
    } catch (error) {
      res.json({message: 'failed on deleting package data', error: error});
    }
  },
  editpackage: async (req, res)=> {
    try {
      const {mainform, places, guid} = req.body;
      const id= new mongoose.Types.ObjectId(req.body.id);
      const {packageName, aboutPackage, packagePrice, fecilities,
        startDate, endDate, offer, offerRate, maximumCapacity,
        availableSlot}=mainform;
      const str = new mongoose.Types.ObjectId(req.tokens.id);
      const prof= await profile.findOne({userId: str});

      const newPlaces = places.map((place) => ({
        placeid: new mongoose.Types.ObjectId(place.placeId),
        placename: place.placename,
        arrivalDate: place.arrivalDate,
        arrivingtime: place.arrivingtime,
        returnDate: place.returnDate,
        returntime: place.returntime,
      }));

      const newguides = guid.map((guide) => ({
        id: new mongoose.Types.ObjectId(guide.id),
        name: guide.name,
      }));

      const update= await package.updateOne({_id: id}, {
        $set: {
          packageName,
          aboutPackage,
          packagePrice,
          fecilities: {
            Transportation: fecilities.Transportation,
            Accommodation: fecilities.Accommodation,
            Meals: fecilities.Meals,
            ProfessionalGuides: fecilities.ProfessionalGuides,
            LanguageSupport: fecilities.LanguageSupport,
            TravelInsurance: fecilities.TravelInsurance,
            CustomerSupport: fecilities.CustomerSupport,
          },
          startDate,
          endDate,
          offer,
          offerRate,
          maximumCapacity,
          availableSlot,
          places: newPlaces,
          guid: newguides,
          agencyid: prof._id,
        }});

      if (update) {
        res.json({success: true, message: 'package updatted succes fully'});
      } else {
        res.status(404).json({success: false, message: 'package added failed'});
      }
    } catch (error) {
      res.status(404).json({message: `failed to edit to package and error is : ${error}`});
    }
  },
};
