const mongoose =require('mongoose');
const package= require('../models/package');
const wishlist= require('../models/wishlist');


module.exports={
  addtowishlist: async (req, res) =>{
    try {
      const {id} = req.body;
      const userid = new mongoose.Types.ObjectId(req.tokens.id);
      const packageId= new mongoose.Types.ObjectId(id);
      const pkg= await package.findOne({_id: packageId});
      const already = await wishlist.aggregate([{$match: {$and: [{userId: userid}, {packageId: packageId}]}}]);
      if (already && already.length>0) {
        res.json({message: 'package already added to wishlist'});
      } else {
        const newwishlist = new wishlist({
          packageId: packageId,
          userId: new mongoose.Types.ObjectId(userid),
          agencyId: pkg.agencyid,
        });

        const savedwishlist = await newwishlist.save();
        if (savedwishlist) {
          res.json({success: true});
        } else {
          res.json({success: false, message: 'wishlist added failed'});
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  getwishlist: async (req, res) =>{
    try {
      const userid = new mongoose.Types.ObjectId(req.tokens.id);
      const wish = await wishlist.aggregate([
        {
          $match: {
            userId: userid, // Add your userid variable here
          },
        },
        {
          $lookup: {
            from: 'agencies',
            localField: 'agencyId',
            foreignField: '_id',
            as: 'agencydetails',
          },
        },
        {
          $lookup: {
            from: 'packages',
            localField: 'packageId',
            foreignField: '_id',
            as: 'packagedetails',
          },
        },
      ]);

      if (wish && wish.length>0) {
        res.json({success: true, data: wish, message: 'wishlist getted'});
      } else {
        res.json({success: false, message: 'wishlist getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  removewishlist: async (req, res)=> {
    try {
      const id= new mongoose.Types.ObjectId(req.params.id);
      const dtl= await wishlist.deleteOne({_id: id});
      if (dtl.deletedCount === 1) {
        res.json({success: true, message: 'Item deleted successfully'});
      } else {
        res.json({success: false, message: 'Item not found'});
      }
    } catch (err) {
      res.json({message: 'failed on deleting place data', error: err});
    }
  },
};
