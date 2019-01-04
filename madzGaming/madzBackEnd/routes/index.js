var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();


var options = { connectTimeoutMS: 5000, useNewUrlParser: true };
mongoose.connect('mongodb://madz:madz73@ds149414.mlab.com:49414/madzgaming', options, function(err) {
  console.log(err);
});

var userSchema = mongoose.Schema({ pseudo: String, email: String, password: String,});
var userModel = mongoose.model('user', userSchema);

router.post('/signup', function(req, res, next) {

  let atExist = false;
  let atValid = false;
  let emailInspect = req.body.email;
  let isExist = false;

  if(emailInspect.indexOf("@") < 0){
    res.json({ atExist });
  } else if (emailInspect.indexOf("@") >= 0){

    if(emailInspect.indexOf("@") >= 3){
        if(emailInspect.indexOf(".") >= 0){
          atValid = true;
          console.log(atValid);
        }else{
          res.json({ atValid });
        }
    }else{
      res.json({ atValid });
     }
  }

  if(atValid){
    userModel.find(
      { email: req.body.email } ,
      function (err, users) {
        if (users.length == 0) {
          var newUser = new userModel ({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: req.body.password,
          });
          newUser.save(function(error, user) {
            res.json({ isExist, user });
          });
        }
        else if (users.length > 0){
          isExist = true
          res.json({ isExist });
        }
      }
    )
  }else{
    res.json({ atValid });
  }
});

module.exports = router;
