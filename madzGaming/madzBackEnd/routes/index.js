var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();


var options = { connectTimeoutMS: 5000, useNewUrlParser: true };
mongoose.connect('mongodb://madz:madz73@ds149414.mlab.com:49414/madzgaming', options, function(err) {
  console.log(err);
});

var userSchema = mongoose.Schema({ pseudo: String, email: String, password: String,});
var userModel = mongoose.model('user', userSchema);


// Vérifie que le pseudo comporte entre 3 et 20 caractéres
const pseudoIsValid = pseudo => {
  let isValid = false
  if(pseudo.length >= 3 && pseudo.length <= 20){
    isValid = true
  }
  return isValid;
};

// Vérifie que le password comporte entre 4 et 15 caractéres
const passwordIsValid = password => {
  let isValid = false
  if(password.length >= 4 && password.length <= 15){
    isValid = true
  }
  return isValid;
};


router.post('/signup', function(req, res, next) {

  let isExist = false;
  let readyToDb = false

  if(!pseudoIsValid(req.body.pseudo)){
    res.json({ pseudoValid: false});
  }
  else if(!passwordIsValid(req.body.password)){
    res.json({ passwordValid: false});
  }else{
    readyToDb = true
  }

  if (readyToDb) {
    userModel.find(
      { email: req.body.email } ,
      function (err, users) {
        if (users.length == 0) {
          var newUser = new userModel ({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: req.body.password,
          });
          newUser.save(
            function(error, user) {
              if (err){
                res.json({
                  signup : false,
                  result : err
                })
              } else {
                res.json({
                  signup : true,
                  result : user,
                })
              }
          });
        }
        else if (users.length > 0){
          isExist = true
          res.json({ isExist });
        }
      }
    )
  }
});

module.exports = router;
