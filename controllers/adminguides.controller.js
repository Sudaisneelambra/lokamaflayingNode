const guides = require('../models/guidadd');

module.exports = {
  gettingguides: async (req, res) => {
    try {
      const guid = await guides.aggregate([
        {
          $lookup: {
            from: 'agencies',
            localField: 'agencyid',
            foreignField: '_id',
            as: 'agencydetails',
          },
        },
      ]);
      if (guid) {
        res.json({
          success: true,
          data: guid,
          message: 'guid getting successfull',
        });
      } else {
        res.json({success: false, message: 'guid getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
};
