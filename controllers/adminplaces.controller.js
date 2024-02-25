const place= require('../models/mongose/agency/placeadd');

module.exports={
  gettingallplaces: async (req, res)=> {
    try {
      const places = await place.aggregate([{$lookup: {from: 'agencies',
        localField: 'agencyid', foreignField: '_id', as: 'agencydetails'}}]);
      if (places) {
        res.json({
          success: true,
          data: places,
          message: 'succesfully got the all places',
        });
      } else {
        res.json({
          success: false,
          message: 'getting places failed',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
