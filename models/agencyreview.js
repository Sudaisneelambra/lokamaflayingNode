const mongoose = require('mongoose');
const agencyreview = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  agencyid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


const reviewagency = mongoose.model('reviewagency', agencyreview);

module.exports = reviewagency;
