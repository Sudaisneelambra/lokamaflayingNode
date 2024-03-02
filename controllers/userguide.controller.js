const guide= require('../models/guidadd');

module.exports={
  getguide: async (req, res) =>{
    try {
      const guides = await guide.aggregate([{$lookup: {from: 'agencies',
        localField: 'agencyid', foreignField: '_id', as: 'agencydetails'}}]);
      if (guides) {
        res.json({success: true, data: guides, message: 'guide getted successfully'});
      } else {
        res.json({success: false, message: 'guide getted gfailed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
};
