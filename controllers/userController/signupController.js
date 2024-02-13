/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */
// requiring otp generator
const otpgenerator = require('otp-generator');
require('dotenv').config();
const serviceSid=process.env.SERVICESIDTWILIO;
const accountSid=process.env.ACCOUNTSIDTWILIO;
const authId=process.env.AUTHTOCKENTWILIO;
const secretKey=process.env.SECRET_KEY;
const twilio = require('twilio');
const client = twilio(accountSid, authId);
const bcrypt = require('bcrypt');
const starRound = 10;
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const agency=require('../../models/mongose/agency/profileadd');


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
      const {
        username,
        email,
        password,
        phoneNumber,
        role,
      } = req.body;

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
                    message: `otp send filed : ${err}`,
                  });
                  console.log('otp send aayilla');
                  console.log(err);
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
      const {
        otp,
        username,
        email,
        password,
        phoneNumber,
        role,
      }=req.body;
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
        const token = jwt.sign({
          id: mailOnly.id,
          username: mailOnly.username,
        },
        secretKey,
        {
          expiresIn: '1h',
        });

        res.json({
          success: true,
          user: true,
          message: 'successfully verified user',
          token,
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
  postLogin: async (req, res)=>{
    try {
      const {
        mail,
        pass,
      } =req.body;

      const mailOnly= await signupuser.findOne({
        email: mail,
      });
      const sin= mailOnly._id;
      if (mailOnly) {
        const passMatch = await bcrypt.compare(pass, mailOnly.password);

        if (!passMatch) {
          console.log('incorrect');
          res.json({
            message: 'password incorrect',
          });
        } else {
          console.log(mailOnly);
          const token = jwt.sign({
            id: mailOnly._id,
            username: mailOnly.username,
            verified: mailOnly.verified,
          },
          secretKey,
          {
            expiresIn: '1h',
          });

          if (passMatch && mailOnly.isAdmin) {
            console.log('admin');
            res.json({
              success: true,
              admin: true,
              token,
              type: 'admin',
            });
            console.log(token);
          } else if (passMatch && mailOnly.role.user) {
            console.log('user');
            res.json({
              success: true,
              user: true,
              message: 'user successfully registered',
              token,
              type: 'user',
            });
            console.log(token);
          } else if (passMatch && mailOnly.role.agency && mailOnly.verified) {
            console.log('registered agency');

            const already= await signupuser.aggregate([{$match: {_id: new mongoose.Types.ObjectId(sin)}},
              {$lookup: {from: 'agencies',
                localField: '_id', foreignField: 'userId', as: 'agencyfulldetails'}}]);
            console.log(already);

            if (already.length > 0 && already[0].agencyfulldetails.length > 0) {
              res.json({
                success: true,
                resistered: true,
                message: 'registered agency',
                token,
                profileadd: true,
                type: 'agency',
              });
              console.log(token);
            } else {
              res.json({
                success: true,
                resistered: true,
                message: 'registered agency',
                token,
                profileadd: false,
                type: 'agency',
              });
            }
          } else {
            console.log('not registered agency');
            emails(
                mail,
                'processing verification message',
                // eslint-disable-next-line max-len
                `dear costomer ,your verification message send to the admin,but he didnt verified your mail, wait for verification`,
            );
            res.json({success: true, resistered: false, message: 'not registered agency'});
          }
        }
      } else {
        console.log('user not found');
        res.json({message: 'user not found'});
      }
    } catch (error) {
      console.log(error);
    }
  },

  logout: (req, res)=>{
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({message: 'Error destroying session'});
      } else {
        console.log('distroyd');
        res.json({message: 'Logged out successfully'});
      }
    });
  },


};
