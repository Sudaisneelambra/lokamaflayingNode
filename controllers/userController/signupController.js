/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */
// requiring otp generator
const otpgenerator = require('otp-generator');
require('dotenv').config();
const serviceSid=process.env.SERVICESIDTWILIO;
const accountSid=process.env.ACCOUNTSIDTWILIO;
const authId=process.env.AUTHTOCKENTWILIO;
const twilio = require('twilio');
const client = twilio(accountSid, authId);
const bcrypt = require('bcrypt');
const starRound = 10;


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
        res.status(400).json({
          message: 'Please fill all the fields',
        });
      } else {
        if (data.role) {
        // find existing user
          const existingUser=await signupuser.findOne({
            username: username,
            email: email,
            password: password,
            isAdmin: false,
            phoneNumber: phoneNumber,
            'role.user': true,
          });

          // find existing agency
          const existAgency=await signupuser.findOne({
            username: username,
            email: email,
            password: password,
            isAdmin: false,
            phoneNumber: phoneNumber,
            'role.agency': true,
          });

          // find email exist
          const emailexist=await signupuser.findOne({
            email: email,
          });
          // find phonenumber exist
          const phonenumberexist=await signupuser.findOne({phoneNumber: phoneNumber});
          if (existingUser) {
            res.json({
              message: 'user already exist.please login',
            });
          } else if (existAgency) {
            res.json({
              message: 'agency already exist.please login',
            });
          } else if (emailexist) {
            res.json({
              message: 'email already used',
            });
          } else if (phonenumberexist) {
            res.json({
              message: 'phonenumber already used',
            });
          } else {
            const otp = otpgenerator.generate(6, {
              digits: true,
              lowerCaseAlphabets: false,
              upperCaseAlphabets: false,
              specialChars: false,
            });

            otpSend(phoneNumber)
                .then((msg)=>{
                  res.json({
                    otpsend: true,
                    message: 'otp send successfully',
                  });
                  console.log('otp send aayi');
                })
                .catch((err)=>{
                  res.json({
                    otpsend: false,
                    message: 'otp send filed',
                  });
                  console.log('otp send aayilla');
                });
            emails(email, 'otp verification mail', `your verification otp is ${otp}. please verify this otp`);
            // .then((msg)=>{
            //   res.json({otpsend: true, message: 'otp send successfully'});
            //   console.log('otp send aayi');
            // })
            // .catch((err)=>{
            //   res.json({otpsend: false, message: 'otp send filed'});
            //   console.log('otp send aayilla');
            // });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  },


  postOtpverification: async (req, res)=>{
    try {
      const {otp, username, email, password, phoneNumber, role}=req.body;
      const phone=+phoneNumber;

      // verification check
      const verificationCheck =await client.verify.v2.services(serviceSid)
          .verificationChecks.create({to: `+91${phone}`, code: otp});

      // if user or agency check

      const hashedPassword = await bcrypt.hash(password, starRound);

      if (verificationCheck && verificationCheck.status==='approved' && role.user) {
        const user= new signupuser({
          username,
          email,
          password: hashedPassword,
          isAdmin: false,
          phoneNumber,
          verified: true,
          role: {
            agency: false,
            user: true,
          },
        });

        await user.save();

        res.json({
          success: true,
          user: true,
          message: 'successfully verified user',
        });
      } else if (verificationCheck && verificationCheck.status==='approved' && role.agency) {
        const agency = new signupuser({
          username,
          email,
          password: hashedPassword,
          isAdmin: false,
          phoneNumber,
          verified: false,
          role: {
            agency: true,
            user: false,
          }});

        await agency.save();

        // if agency ,send mail to agency
        emails(
            email,
            'agency verification mail',
            `dear costomer ,verification message send to the admin,you can go 
            to the agency dashboard after the verification of admin, 
            please wait for admin's verification`,
        );

        res.json({
          success: true,
          agency: true,
          message: 'agency registered,wait the admin verification',
        });
      } else {
        res.json({
          success: false,
          message: 'otp verification failed',
        });
      }
    } catch (err) {
      console.log('errpreeee');
      res.json({
        message: 'verification failed',
      });
    };
  },


};
