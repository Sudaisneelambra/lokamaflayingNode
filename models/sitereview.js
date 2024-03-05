const mongoose = require('mongoose');
const webpagereview = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  userId: {
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


const pagereview = mongoose.model('pagereview', webpagereview);

module.exports = pagereview;
