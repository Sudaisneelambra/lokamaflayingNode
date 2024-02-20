const jwt = require('jsonwebtoken');


const checkTocken=(req, res, next)=>{
  const secretKey= process.env.SECRET_KEY;
  const authorizationHeader = req.headers['authorization'];
  jwt.verify(authorizationHeader, secretKey, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      res.json({message: `verification fialed due to  ${err.message}`, expiry: err.message});
    } else {
      // Token is verified successfully
      const expirationTime = decoded.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (expirationTime < currentTime) {
        console.log('Authorization header has expired');
      } else {
        console.log('Authorization header is still valid');
        req.tokens= decoded;
        next();
      }
    }
  });
};

module.exports=checkTocken;
