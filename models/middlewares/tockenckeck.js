const jwt = require('jsonwebtoken');

const checkTocken=(req, res, next)=>{
  const authorizationHeader = req.headers['authorization'];
  const decodedToken = jwt.decode(authorizationHeader);

  req.tokens= decodedToken;
  next();
};

module.exports=checkTocken;
