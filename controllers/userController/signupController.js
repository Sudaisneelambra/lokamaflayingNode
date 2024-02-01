/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */
// requiring otp generator
const otpgenerator = require('otp-generator');

// requiring email send from another folder
const emails = require('../../models/mailsend/mailSend');
const otpSend = require('../../models/mailsend/otpPhone');

const signupuser=require('../../models/mongose/user/signup');

module.exports = {
  getSignup: () => {
    console.log('sudais neelambra');
  },
  postSignup: async (req, res) => {
    try {
      const data = req.body;
      const {username, email, password, phoneNumber, role} = req.body;
      if (!username&&!email&&!password&&!phoneNumber) {
        res.status(400).json({message: 'Please fill all the fields'});
      } else {
        if (data.role && data.role.user) {
          const exist=await signupuser.findOne({username: username,
            email: email, password: password, isAdmin: false,
            phoneNumber: phoneNumber, 'role.user': true});
          const emailexist=await signupuser.findOne({email: email});
          const phonenumberexist=await signupuser.findOne({phoneNumber: phoneNumber});
          if (exist) {
            res.json({message: 'user already exist.please login'});
          } else if (emailexist) {
            res.json({message: 'email already used'});
          } else if (phonenumberexist) {
            res.json({message: 'phonenumber already used'});
          } else {
            const otp = otpgenerator.generate(6, {
              digits: true,
              lowerCaseAlphabets: false,
              upperCaseAlphabets: false,
              specialChars: false,
            });
            otpSend(phoneNumber)
                .then((msg)=>{
                  res.json({otpsend: true, message: 'otp send successfully'});
                  console.log('otp send aayi');
                })
                .catch((err)=>{
                  res.json({otpsend: false, message: 'otp send filed'});
                  console.log('otp send aayilla');
                });
            emails(email, 'otp verification mail', otp);
          }
        } else if (data.role && data.role.agency) {
          const exist=await signupuser.findOne({username: username,
            email: email, password: password, isAdmin: false,
            phoneNumber: phoneNumber, 'role.agency': true});
          const usernameexist=await signupuser.findOne({username: username});
          const emailexist=await signupuser.findOne({email: email});
          const phonenumberexist=await signupuser.findOne({phoneNumber: phoneNumber});
          if (exist) {
            res.json({alreadyexist: true, message: 'agency already exist.please login'});
          } else if (usernameexist) {
            res.json({usernameExist: true, message: 'agency username already used'});
          } else if (emailexist) {
            res.json({emailExist: true, message: 'email already used'});
          } else if (phonenumberexist) {
            res.json({phonenumberExist: true, message: 'phonenumber already used'});
          } else {
            const otp = otpgenerator.generate(6, {
              digits: true,
              lowerCaseAlphabets: false,
              upperCaseAlphabets: false,
              specialChars: false,
            });
            otpSend(phoneNumber)
                .then((msg)=>{
                  res.json({otpsend: true, message: 'otp send successfully'});
                  console.log('otp send aayi');
                })
                .catch((err)=>{
                  res.json({otpsend: false, message: 'otp send filed'});
                  console.log('otp send aayilla');
                });
            emails(email, 'otp verification mail', otp);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
