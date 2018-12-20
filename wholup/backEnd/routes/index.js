var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var options = {server:{socketOptions:{connectTimeoutMS: 5000}}};
mongoose.connect('mongodb://madian:kooples73@ds255970.mlab.com:55970/wholup', options, function(err) {
  console.log(err);
});

var userSchema = mongoose.Schema({firstName: String, lastName: String, job:String, email: String, password: String});
var userModel = mongoose.model('user', userSchema);

var followSchema = mongoose.Schema({firstName: String, lastName: String, job:String, email: String, userId: String});
var followModel = mongoose.model('follow', followSchema);

router.post('/sign-in', function(req, res, next) {

  console.log(req.body.email);

  userModel.find(
    { email: req.body.email.toLowerCase(),
      password: req.body.password.toLowerCase(),
    },
    function(err, user){
    var datas = user;
    var isUserExist;
    var userEmail;
    var userFirstName;
    var userJob;
    var userLastName;
    var userId;


    if(datas.length == 0){
      isUserExist = false
    } else if(datas.length > 0){
        var userEmail = datas[0].email;
        var userFirstName = datas[0].firstName;
        var userJob = datas[0].job;
        var userLastName = datas[0].lastName;
        var userId = datas[0]._id;
        isUserExist = true
    }
    res.json({ isUserExist, userEmail, userFirstName, userLastName, userJob, userId });
  });
});





router.post('/sign-up', function(req, res, next) {
  console.log(req.body);
  var newUser = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    job: req.body.job,
    email: req.body.email.toLowerCase(),
    password: req.body.password.toLowerCase()
  })

  newUser.save(function(error, user) {
    userModel.find(function(err, user){
      var data = [...user]
      res.json({ data });
    });
  });
});



router.get('/finduser', function(req, res, next) {
  userModel.find(function(err, user){

    res.json({ user:user });
  });
});


router.post('/follow', function(req, res, next) {

    followModel.find(
      {
        userId: req.body.Id,
        email: req.body.email
      },
      function(err, user){
        if(user.length == 0){
          var newFollow = new followModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            job: req.body.job,
            email: req.body.email,
            userId: req.body.Id
          })
          newFollow.save(function(error, user) {});
        }else{
          console.log('user exist');
        }
      });

    res.json({ result: 'true' });
  });


  router.post('/findFollow', function(req, res, next) {


      followModel.find(
        {userId: req.body.Id},
        function(err, user){
          console.log(user);
          res.json({ user: user });
        });
  });



module.exports = router;
