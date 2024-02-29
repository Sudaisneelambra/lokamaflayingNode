const mongoose = require('mongoose');
const userprofile = require('../models/userprofile');
const signup =require('../models/signup');

module.exports = {
  profileadd: async (req, res) => {
    try {
      const id = req.tokens.id;
      const {
        fullName,
        emailAddress,
        gender,
        address,
        phoneNumber,
        nationality,
        dateOfBirth,
        houseNo,
        street,
        zipCode,
        district,
        state,
      } = req.body;

      await userprofile.updateOne(
          {userId: new mongoose.Types.ObjectId(id)},
          {
            $set: {
              fullName,
              emailAddress,
              gender,
              address,
              phoneNumber,
              nationality,
              dateOfBirth,
              houseNo,
              street,
              zipCode,
              district,
              state,
              userId: new mongoose.Types.ObjectId(id),
            },
          },
          {upsert: true},
      )
          .then(() => {
            res.json({
              success: true,
              message: 'profiledata added successfully',
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json({message: err.message});
          });
    } catch (err) {
      console.log(err);
    }
  },
  getprofile: async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.tokens.id);
      const prof = await userprofile.findOne({userId: id});
      if (prof) {
        res.json({success: true, data: prof});
      } else {
        res
            .status(404)
            .json({success: false, message: 'profiegetting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  getprof: async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      console.log(id);
      console.log('suda');
      const prof = await userprofile.findOne({_id: id});
      if (prof) {
        console.log(prof);
        res.json({success: true, data: prof});
      } else {
        res
            .status(404)
            .json({success: false, message: 'profiegetting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  username: async (req, res) =>{
    try {
      const id = new mongoose.Types.ObjectId(req.tokens.id);
      const username = await signup.findOne({_id: id}).select('username');
      if (username) {
        res.json({success: true, data: username});
      } else {
        res
            .status(404)
            .json({success: false, message: 'username getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
};
