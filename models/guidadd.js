const mongoose = require('mongoose');
const guidschema = new mongoose.Schema({
  guidename: {
    type: String,
    required: true,
  },
  aboutguide: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  guideurl: {
    type: String,
    required: true,
  },
  agencyid: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Agency',
  },
});


const guide = mongoose.model('guide', guidschema);

module.exports = guide;
