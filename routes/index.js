var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('/index.html');
});

module.exports = router;

exports.sensor = function(req,res){
	console.log(req.body);
};
