const user = require('../models/signup');
const emails = require('../utils/mailSend');
const mongoose = require('mongoose');

module.exports={
  requests: async (req, res) =>{
    try {
      const usr= await user.find({verified: false});
      if (usr) {
        res.json({success: true, data: usr});
      } else {
        res.json({success: false, data: 'user not found'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  approve: async (req, res) => {
    try {
      const {id} =req.body;
      const update= await user.updateOne({_id: id}, {$set: {verified: true}});
      if (update) {
        const usr = await user.findOne({_id: new mongoose.Types.ObjectId(id)});
        const email = usr.email;
        emails(
            email,
            'admin approval',
            // eslint-disable-next-line max-len
            `Dear customer, the Lokahama admin has approved your registration of agency . u can login and add details .`,
        )
            .then(()=>{
              res.json({success: true, message: 'admin approved'});
            })
            .catch((error) => {
              console.error('Error sending email:', error);
              res.status(500).json({success: false, message: 'Error sending email'});
            });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
