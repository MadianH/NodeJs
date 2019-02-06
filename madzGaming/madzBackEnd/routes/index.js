var express = require('express');
var mongoose = require('mongoose');
const nodemailer = require("nodemailer");
var router = express.Router();

const bcrypt = require('bcrypt');
var salt = "$2a$10$rx6.LcM0Eycd3JfZuRVUsO"; //To crypt the user password

var options = { connectTimeoutMS: 5000, useNewUrlParser: true };
mongoose.connect('mongodb://madz:madz73@ds149414.mlab.com:49414/madzgaming', options, function(err) {
  console.log(err);
});



var userSchema = mongoose.Schema({ pseudo: String, email: String, password: String,});
var userModel = mongoose.model('user', userSchema);


// var sendEmail = function(email, id){
//   return new Promise(function(resolve, reject){
//
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       host: "in-v3.mailjet.com",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "379270f8f4bc72df51cc38464d0e97ed", // generated ethereal user
//         pass: "9131b5778727875637ef0627ec57af00" // generated ethereal password
//       },
//       tls:{
//         rejectUnauthorized:false
//       }
//     });
//
//     transporter.verify(function(error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to take our messages");
//     }
//     });
//
//     // setup email data with unicode symbols
//     let mailOptions = {
//       from: '"Madz Company" <web.madz.company@gmail.com>', // sender address
//       to: email, // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "test 2", // plain text body
//       html: '<p>Bienvenue chez Madz Company</p><p><a href="https://127.0.0.1:3000/validEmail?id= + {id}" >Clique ici pour confirmer ton inscription</a></p>', // html body
//      };
//
//     // send mail with defined transport object
//      transporter.sendMail(mailOptions, (error, info) => {
//        if(error){
//          console.log(error);
//          reject(error)
//        }else {
//          console.log(info);
//          resolve(info)
//        }
//      })
//
//   })
// };



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
  let readyToDb = false;

  if(!pseudoIsValid(req.body.pseudo)){
    res.json({ pseudoValid: false});
  }
  else if(!passwordIsValid(req.body.password)){
    res.json({ passwordValid: false});
  }
  else{
    readyToDb = true
  }

  if (readyToDb) {
    userModel.find(
      { email: req.body.email } ,
      function (err, users) {
        if (users.length == 0) {
          let hash = bcrypt.hashSync(req.body.password, salt);
          var newUser = new userModel ({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: hash,
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


router.post('/signin', function(req, res, next) {
  var hash = bcrypt.hashSync(req.body.password, salt);
  userModel.find(
     {email: req.body.email, password: hash} ,
     function (err, users) {
       if(err){
         res.json({ err });
       }
       else{
         console.log(users);
         res.json({ users });
       }
     }
  )
})


module.exports = router;
