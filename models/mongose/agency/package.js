const mongoose = require('mongoose');
const packageschema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
  },
  aboutPackage: {
    type: String,
    required: true,
  },
  packagePrice: {
    type: Number,
    required: true,
  },
  fecilities: {
    Transportation: {
      type: Boolean,
      required: true,
      default: false,
    },
    Accommodation: {
      type: Boolean,
      required: true,
      default: false,
    },
    Meals: {
      type: Boolean,
      required: true,
      default: false,
    },
    ProfessionalGuides: {
      type: Boolean,
      required: true,
      default: false,
    },
    LanguageSupport: {
      type: Boolean,
      required: true,
      default: false,
    },
    TravelInsurance: {
      type: Boolean,
      required: true,
      default: false,
    },
    CustomerSupport: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  offer: {
    type: String,
    required: true,
  },
  offerRate: {
    type: Number,
    default: 'no',
  },
  maximumCapacity: {
    type: Number,
    required: true,
  },
  availableSlot: {
    type: Number,
    required: true,
  },
  places: {
    type: [{
      placeid: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'places',
      },
      placename: {
        type: String,
        required: true,
      },
      arrivingtime: {
        type: String,
        required: true,
      },
      returntime: {
        type: String,
        required: true,
      },
    }],
    required: true,
  },
  guid: {
    type: [{
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'guides',
      },
      name: {
        type: String,
        required: true,
      },
    }],
    required: true,
  },
  agencyid: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Agency',
  },
});


const package = mongoose.model('package', packageschema);

module.exports = package;
