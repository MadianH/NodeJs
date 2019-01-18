var express = require('express');
var mongoose = require('mongoose');
const nodemailer = require("nodemailer");
var router = express.Router();


var options = { connectTimeoutMS: 5000, useNewUrlParser: true };
mongoose.connect('mongodb://madz:madz73@ds149414.mlab.com:49414/madzgaming', options, function(err) {
  console.log(err);
});



var userSchema = mongoose.Schema({ pseudo: String, email: String, password: String,});
var userModel = mongoose.model('user', userSchema);


// Envoi email
const sendEmail = email => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "379270f8f4bc72df51cc38464d0e97ed", // generated ethereal user
      pass: "9131b5778727875637ef0627ec57af00" // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Madz Company" <web.madz.company@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "test 2", // plain text body
    html: "<b>Hello world?</b>" // html body
   };

  // send mail with defined transport object
   transporter.sendMail(mailOptions, (error, info) => {
     if(error){
       return console.log(error);
     }else {
       console.log(info);
     }
   })

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};



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

  sendEmail(req.body.email)

  // let isExist = false;
  // let readyToDb = false
  //
  // if(!pseudoIsValid(req.body.pseudo)){
  //   res.json({ pseudoValid: false});
  // }
  // else if(!passwordIsValid(req.body.password)){
  //   res.json({ passwordValid: false});
  // }else{
  //   readyToDb = true
  // }
  //
  // if (readyToDb) {
  //   userModel.find(
  //     { email: req.body.email } ,
  //     function (err, users) {
  //       if (users.length == 0) {
  //         var newUser = new userModel ({
  //           pseudo: req.body.pseudo,
  //           email: req.body.email,
  //           password: req.body.password,
  //         });
  //         newUser.save(
  //           function(error, user) {
  //             if (err){
  //               res.json({
  //                 signup : false,
  //                 result : err
  //               })
  //             } else {
  //               console.log('ID',user._id);
  //               console.log('email',user.email);
  //
  //               res.json({
  //                 signup : true,
  //                 result : user,
  //               })
  //             }
  //         });
  //       }
  //       else if (users.length > 0){
  //         isExist = true
  //         res.json({ isExist });
  //       }
  //     }
  //   )
  // }
});

module.exports = router;
