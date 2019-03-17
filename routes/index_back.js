var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
	  title: 'sh1811',
	  data: [
		  { "username" : "<h1>赵坤</h1>", "age" : 24 },
		  { "username" : "林浩", "age" : 24 },
		  { "username" : "王飞龙", "age" : 24 },
		  { "username" : "杨洋", "age" : 22 },
		  { "username" : "武朋飞", "age" : 24 },
		  { "username" : "杨丽丽", "age" : 23 }
	  ],
	  flag: false
	});
});

module.exports = router;
