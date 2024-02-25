const mongoose = require('mongoose');
const signupuser = require('../models/mongose/user/signup');
const emails = require('../models/mailsend/mailSend');
// const profile = require('../models/mongose/agency/profileadd');

module.exports = {
  getagencylist: async (req, res) => {
    try {
      const list = await signupuser.aggregate([
        {
          $match: {
            $and: [
              {'role.user': {$ne: true}},
              {'isAdmin': false},
              {'blockstatus': {$ne: true}},
              {'verified': {$ne: false}},
            ],
          },
        },
        {
          $lookup: {
            from: 'agencies',
            localField: '_id',
            foreignField: 'userId',
            as: 'fulldetails',
          },
        },
      ]);
      console.log(list);
      res.json({list});
    } catch (error) {
      console.log(error);
    }
  },
  getblockedagencylist: async (req, res) => {
    try {
      const list = await signupuser.aggregate([
        {
          $match: {
            $and: [
              {'role.user': {$ne: true}},
              {'isAdmin': false},
              {'blockstatus': {$ne: false}},
              {'verified': {$ne: false}},
            ],
          },
        },
        {
          $lookup: {
            from: 'agencies',
            localField: '_id',
            foreignField: 'userId',
            as: 'fulldetails',
          },
        },
      ]);
      console.log(list);
      res.json({list});
    } catch (error) {
      console.log(error);
    }
  },
  agencyblock: async (req, res) => {
    try {
      const {id}= req.body;
      const usr = await signupuser.findOne({_id: new mongoose.Types.ObjectId(id)});
      const email = usr.email;
      emails(
          email,
          'admin action',
          // eslint-disable-next-line max-len
          `Dear agency, the Lokahama admin has blocked your access to our website due to some illegal issues. We apologize for the inconvenience.`,
      )
          .then(async () => {
            const updated = await signupuser.updateOne(
                {_id: new mongoose.Types.ObjectId(id)},
                {$set: {blockstatus: true}},
            );
            console.log(updated);
            res.json({success: true, message: 'succesfully blocked'});
          })
          .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).json({success: false, message: 'Error sending email'});
          });
    } catch (err) {
      console.log(err);
    }
  },
  agencyunblock: async (req, res) => {
    try {
      const {id}= req.body;
      const usr = await signupuser.findOne({_id: new mongoose.Types.ObjectId(id)});
      const email = usr.email;
      emails(
          email,
          'admin action',
          // eslint-disable-next-line max-len
          `Dear agency, the Lokahama admin has unblocked .`,
      )
          .then(async () => {
            const updated = await signupuser.updateOne(
                {_id: new mongoose.Types.ObjectId(id)},
                {$set: {blockstatus: false}},
            );
            console.log(updated);
            res.json({success: true, message: 'succesfully unblocked'});
          })
          .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).json({success: false, message: 'Error sending email'});
          });
    } catch (err) {
      console.log(err);
    }
  },
};
