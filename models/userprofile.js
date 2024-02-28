const mongoose=require('mongoose');

const userprofile=new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  houseNo: {
    type: Number,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const profileuser = mongoose.model('userprofile', userprofile);

module.exports=profileuser;
