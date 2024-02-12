const jwt = require('jsonwebtoken');

const checkTocken=(req, res, next)=>{
  console.log('-----------------jjjj-----------');
  const authorizationHeader = req.headers['authorization'];
  console.log(authorizationHeader);
  console.log('--------------jjjjjj--------------');

  const decodedToken = jwt.decode(authorizationHeader);

  req.tokens= decodedToken;
  //   console.log(req.body);
  next();
};

module.exports=checkTocken;
