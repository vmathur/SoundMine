var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

exports.sensor = function(req,res){
	console.log('hi');
};

// var object = {value: "N/A", bob: "N/A"};


// exports.index = function(req, res){
  
//  res.redirect("/index.html");
//    //res.render('index', { title: 'Express' });
// };

// exports.send = function(req, res){
//  console.log("sending new content");
//  res.send(object);
//    //res.render('index', { title: 'Express' });
// };

// exports.update = function(req,res){

//   var jsonName1 = req.body.Item1;
//   var jsonName2 = req.body.Item2;
//   object.value=jsonName1;
//   object.bob=jsonName2;

//   //console.log("Name: "+jsonName);
//   res.send("MSG RECIEVED");
// };

