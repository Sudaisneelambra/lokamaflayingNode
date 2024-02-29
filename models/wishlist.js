const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  agencyId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});


const wishlist = mongoose.model('wishlist', wishlistSchema);

module.exports = wishlist;
