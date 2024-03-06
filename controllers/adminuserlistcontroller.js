const mongoose = require('mongoose');
const signupuser = require('../models/signup');
const user = require('../models/signup');

const emails = require('../utils/mailSend');


module.exports ={
  getuserlist: async (req, res)=>{
    try {
      const userlist = await signupuser.find({'role.user': true, 'isAdmin': {$ne: true}, 'blockstatus': {$ne: true}});
      res.json({userlist});
    } catch (error) {
      console.log(error);
    }
  },
  getblockeduserlist: async (req, res)=>{
    try {
      const userlist = await signupuser.find({'role.user': true, 'isAdmin': {$ne: true}, 'blockstatus': {$ne: false}});
      res.json({userlist});
    } catch (error) {
      console.log(error);
    }
  },
  blockuser: async (req, res)=>{
    try {
      const {id}= req.body;
      const usr = await user.findOne({_id: new mongoose.Types.ObjectId(id)});
      const email = usr.email;
      emails(
          email,
          'admin action',
          // eslint-disable-next-line max-len
          `Dear customer, the Lokahama admin has blocked your access to our website due to some illegal issues. We apologize for the inconvenience.`,
      )
          .then(async () => {
            // eslint-disable-next-line no-unused-vars
            const updated = await signupuser.updateOne(
                {_id: new mongoose.Types.ObjectId(id)},
                {$set: {blockstatus: true}},
            );
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
  unblockuser: async (req, res)=>{
    try {
      const {id}= req.body;
      const usr = await user.findOne({_id: new mongoose.Types.ObjectId(id)});
      const email = usr.email;
      emails(
          email,
          'admin action',
          // eslint-disable-next-line max-len
          `Dear customer, the Lokahama admin has unblocked .`,
      )
          .then(async () => {
            // eslint-disable-next-line no-unused-vars
            const updated = await signupuser.updateOne(
                {_id: new mongoose.Types.ObjectId(id)},
                {$set: {blockstatus: false}},
            );
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


