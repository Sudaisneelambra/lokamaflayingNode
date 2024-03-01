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
});


const pagereview = mongoose.model('pagereview', webpagereview);

module.exports = pagereview;
