/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */


function man(req, res, next) {
  const {username, email, password, phoneNumber, role} = req.body;
  const pPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~]).{8,}$/;
  const uPattern = /^[a-z]*$/;
  const ePattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validpass = pPattern.test(password);
  const validuser = uPattern.test(username);
  const validemail = ePattern.test(email);
  console.log(validpass);
  console.log(validuser);
  console.log(validemail);
  console.log(req.body);
  if (validpass && validuser && validemail) {
    next();
  } else {
    res.json({message: 'fill the fields in correct formate'});
    console.log('llll');
  }
};

module.exports=man;
