const place=require('../mongose/agency/placeadd');
const profile=require('../mongose/agency/profileadd');


const already= async (req, res, next)=>{
  const id=req.tokens.id;
  const {placeName} = req.body;
  const prof = await profile.findOne({userId: id});
  console.log('----------------------');
  console.log(prof);
  console.log(prof._id);
  console.log('----------------------');
  const placeused= await place.find({agencyid: prof._id});
  console.log('----------------------');
  console.log(placeused);
  console.log('----------------------');

  if (Array.isArray(placeused)) {
    const sin = placeused.filter((m)=>{
      return m.placeName == placeName;
    });
    if (sin) {
      console.log('place used');
      res.json({
        msg: 'place already used',
      });
    } else {
      next();
    }
  } else {
    if (placeused.placeName==placeName) {
      console.log('place usedd');
      res.json({
        msg: 'place already used',
      });
    } else {
      next();
    }
  }
};
module.exports = already;
