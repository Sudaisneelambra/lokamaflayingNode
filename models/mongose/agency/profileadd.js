const mongoose = require('mongoose');
const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  services: {
    Tourpackage: {
      type: Boolean,
      required: true,
      default: false,
    },
    CustomerSupport: {
      type: Boolean,
      required: true,
      default: false,
    },
    TransportationServices: {
      type: Boolean,
      required: true,
      default: false,
    },
    HotelReservationServices: {
      type: Boolean,
      required: true,
      default: false,
    },
    TravelConsultationandAdvice: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  contactNumber1: {
    type: Number,
    required: true,
  },
  contactNumber2: {
    type: Number,
    required: true,
  },
  aboutAgency: {
    type: String,
    required: true,
  },
  email: {
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
  location: {
    type: String,
    required: true,
  },
  logo_url: {
    type: String,
    required: true,
  },
  file_urls: {
    type: [String], // Define file_urls as an array of strings
    required: true,
  },
  userId: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'usersignups',
  },
});

const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;
