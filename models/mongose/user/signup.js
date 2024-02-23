const mongoose=require('mongoose');

const signupSchema=new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  blockstatus: {
    type: Boolean,
    default: false,
  },
  role: {
    agency: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Boolean,
      required: true,
    },
  },
});

const signup= mongoose.model('usersignups', signupSchema);

module.exports=signup;
