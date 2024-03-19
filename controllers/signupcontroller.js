/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */
// requiring otp generator
const otpgenerator = require('otp-generator');
require('dotenv').config();
const serviceSid = process.env.SERVICESIDTWILIO;
const accountSid = process.env.ACCOUNTSIDTWILIO;
const authId = process.env.AUTHTOCKENTWILIO;
const secretKey = process.env.SECRET_KEY;
const twilio = require('twilio');
const client = twilio(accountSid, authId);
const bcrypt = require('bcrypt');
const starRound = 10;
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const user = require('../models/signup');

// requiring email send from another folder
const emails = require('../utils/mailSend');
const otpSend = require('../utils/otpPhone');

const signupuser = require('../models/signup');

module.exports = {
  getSignup: () => {},
  postSignup: async (req, res) => {
    try {
      const data = req.body;
      const {username, email, password, phoneNumber, role} = req.body;

      if (!username && !email && !password && !phoneNumber) {
        res.status(400).json({
          message: 'Please fill all the fields',
        });
      } else {
        if (data.role) {
          // find existing user
          const existingUser = await signupuser.findOne({
            username: username,
            email: email,
            password: password,
            isAdmin: false,
            phoneNumber: phoneNumber,
            'role.user': true,
          });

          // find existing agency
          const existAgency = await signupuser.findOne({
            username: username,
            email: email,
            password: password,
            isAdmin: false,
            phoneNumber: phoneNumber,
            'role.agency': true,
          });

          // find email exist
          const emailexist = await signupuser.findOne({
            email: email,
          });
          // find phonenumber exist
          const phonenumberexist = await signupuser.findOne({
            phoneNumber: phoneNumber,
          });
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
            // eslint-disable-next-line brace-style
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
                .then((msg) => {
                  res.json({
                    otpsend: true,
                    message: 'otp send successfully',
                  });
                })
                .catch((err) => {
                  res.json({
                    otpsend: false,
                    message: `otp send filed : ${err}`,
                  });
                });
            emails(
                email,
                'otp verification mail',
                `your verification otp is ${otp}. please verify this otp`,
            );
            // .then((msg)=>{
            //   res.json({otpsend: true, message: 'otp send successfully'});
            // })
            // .catch((err)=>{
            //   res.json({otpsend: false, message: 'otp send filed'});
            // });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  postOtpverification: async (req, response) => {
    try {
      const {otp, username, email, password, phoneNumber, role} = req.body;
      const phone = +phoneNumber;

      // verification check
      const verificationCheck = await client.verify.v2
          .services(serviceSid)
          .verificationChecks.create({to: `+91${phone}`, code: otp})
          .then(async (res) => {
            const hashedPassword = await bcrypt.hash(password, starRound);
            if (
              res &&
            res.status === 'approved' &&
            role.user
            ) {
              const user = new signupuser({
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

              const mailOnly = await user.save();
              const token = jwt.sign(
                  {
                    id: mailOnly._id,
                    username: mailOnly.username,
                    type: 'user',
                  },
                  secretKey,
                  {
                    expiresIn: '1h',
                  },
              );

              response.json({
                success: true,
                user: true,
                message: 'successfully verified user',
                token,
                type: 'user',
              });
            } else if (
              res &&
            res.status === 'approved' &&
            role.agency
            ) {
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
                },
              });

              await agency.save();

              // if agency ,send mail to agency
              emails(
                  email,
                  'agency verification mail',
                  `dear costomer ,verification message send to the admin,you can go 
                  to the agency dashboard after the verification of admin, 
                  please wait for admin's verification`,
              );

              response.json({
                success: true,
                agency: true,
                message: 'agency registered,wait the admin verification',
              });
            } else {
              response.json({
                success: false,
                message: 'otp verification failed not approved',
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });

      // if user or agency check
    } catch (err) {
      console.log(err);
      response.json({
        message: 'verification failed',
      });
    }
  },
  postLogin: async (req, res) => {
    try {
      const {mail, pass} = req.body;
      const mailOnly = await signupuser.findOne({
        email: mail,
      });
      if (mailOnly) {
        const sin = mailOnly._id;
        const passMatch = await bcrypt.compare(pass, mailOnly.password);

        if (!passMatch) {
          res.json({
            message: 'password incorrect',
          });
        } else {
          if (passMatch && mailOnly.isAdmin) {
            const token = jwt.sign(
                {
                  id: mailOnly._id,
                  username: mailOnly.username,
                  verified: mailOnly.verified,
                  type: 'admin',
                },
                secretKey,
                {
                  expiresIn: '1h',
                },
            );
            res.json({
              success: true,
              admin: true,
              message: 'admin successfully logined',
              token,
              type: 'admin',
            });
          } else if (passMatch && mailOnly.role.user && !mailOnly.blockstatus) {
            const token = jwt.sign(
                {
                  id: mailOnly._id,
                  username: mailOnly.username,
                  verified: mailOnly.verified,
                  type: 'admin',
                },
                secretKey,
                {
                  expiresIn: '1h',
                },
            );
            res.json({
              success: true,
              user: true,
              message: 'user successfully logined',
              token,
              type: 'user',
            });
          } else if (passMatch && mailOnly.role.user && mailOnly.blockstatus) {
            res.json({
              message: 'admin blocket your accees to home page',
              token,
              type: 'user',
            });
          } else if (
            passMatch &&
            mailOnly.role.agency &&
            mailOnly.verified &&
            !mailOnly.blockstatus
          ) {
            const token = jwt.sign(
                {
                  id: mailOnly._id,
                  username: mailOnly.username,
                  verified: mailOnly.verified,
                  type: 'agency',
                },
                secretKey,
                {
                  expiresIn: '1h',
                },
            );
            const already = await signupuser.aggregate([
              {$match: {_id: new mongoose.Types.ObjectId(sin)}},
              {
                $lookup: {
                  from: 'agencies',
                  localField: '_id',
                  foreignField: 'userId',
                  as: 'agencyfulldetails',
                },
              },
            ]);

            if (already.length > 0 && already[0].agencyfulldetails.length > 0) {
              res.json({
                success: true,
                resistered: true,
                message: 'registered agency',
                token,
                profileadd: true,
                type: 'agency',
              });
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
          } else if (mailOnly.blockstatus) {
            res.json({
              message: 'admin blocket your accees to home page',
            });
          } else {
            emails(
                mail,
                'processing verification message',
                // eslint-disable-next-line max-len
                `dear costomer ,your verification message send to the admin,but he didnt verified your mail, wait for verification`,
            );
            res.json({
              success: true,
              resistered: false,
              message: 'not registered agency',
            });
          }
        }
      } else {
        res.json({message: 'user not found'});
      }
    } catch (error) {
      console.log(error);
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({message: 'Error destroying session'});
      } else {
        res.json({message: 'Logged out successfully'});
      }
    });
  },
  getcredentials: async (req, res)=>{
    try {
      const cred= await user.find({$or: [{username: 'abdullah'}, {username: 'muhajib'}]});
      if (cred) {
        res.json(cred);
      } else {
        res.status(404).json({data: 'sorry'});
      }
    } catch (err) {
      console.log(err);
    }
  },
  loginwithcredential: async ( req, res) =>{
    try {
      const id = new mongoose.Types.ObjectId(req.body.id);
      const us = await user.findOne({_id: id});
      if (us) {
        const token = jwt.sign(
            {
              id: us._id,
              username: us.username,
              verified: us.verified,
            },
            secretKey,
            {
              expiresIn: '1h',
            },
        );
        res.json({
          success: true,
          user: true,
          message: 'user successfully logined',
          token,
          type: 'user',
        });
      } else {
        res.status(404).json({message: 'error'});
      }
    } catch (err) {
      console.log(err);
    }
  },
};


