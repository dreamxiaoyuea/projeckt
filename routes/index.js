var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.isLogin != 1) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
  res.render('index', { 
		activeIndex: 1
	});
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/loginAction', (req, res, next) => {
  let { username, password } = req.body;
  password = md5(password);
  sql.find('sh1811', 'admin', { username, password }).then(data => {
    if (data.length === 0) {
      req.session.isLogin = 0;  // 未登录
      res.redirect('/login')
    } else {
      req.session.isLogin = 1; // 已登录
      res.redirect('/')
    }
  })
});
router.get('/logout', (req, res, next) => {
  // req.session.isLogin = 0;
  req.session.isLogin = null;
  res.redirect('/login')
});
module.exports = router;
