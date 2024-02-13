const mongoose = require('mongoose');
const placeSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true,
  },
  placeDescription: {
    type: String,
    required: true,
  },
  openingTime: {
    type: String,
    required: true,
  },
  closingTime: {
    type: String,
    required: true,
  },
  entryFee: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  placeurl: {
    type: [String],
    required: true,
  },
  agencyid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});


const place = mongoose.model('place', placeSchema);

module.exports = place;
