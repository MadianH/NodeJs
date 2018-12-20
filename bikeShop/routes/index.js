var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var router = express.Router();

var options = {server: {socketOptions: { connectTimeoutMS: 5000}}};

mongoose.connect('mongodb://madian:kooples73!@ds141028.mlab.com:41028/bikeshop', options, function(err) {
  console.log(err);
});

var userSchema = mongoose.Schema({firstName: String, lastName: String, email: String, password: String, phone: String, address: String, zipcode: Number});
var userModel = mongoose.model('users', userSchema);

var bikeSchema = mongoose.Schema({name: String, url: String, price: String, ref:String, userID: String });
var bikeModel = mongoose.model('bike', bikeSchema);

// var orderSchema = mongoose.Schema({nbOrder: String, total: Number, fraisPort: Number, userID: String});
// var orderModel = mongoose.model('order', orderSchema);






/* GET home page. */
router.get('/', function(req, res, next) {
  var dataBike = [
    {name: "Model BIKO45", url:"/images/bike-1.jpg", price: 679, ref: "#$E100"},
    {name: "Model ZOOK7", url:"/images/bike-2.jpg", price: 799, ref: "#$E101"},
    {name: "Model LIKO89", url:"/images/bike-3.jpg", price: 839, ref: "$#E102"},
    {name: "Model GEWO", url:"/images/bike-4.jpg", price: 1206, ref: "$#E103"},
    {name: "Model TITAN5", url:"/images/bike-5.jpg", price: 989, ref: "$#E104"},
    {name: "Model AMIG39", url:"/images/bike-6.jpg", price: 599, ref: "$#E105"}
  ]
  res.render('index', { dataBike });
});






module.exports = router;
