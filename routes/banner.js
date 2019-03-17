var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var filemd = require('./../tool/file.js');

/* GET banner listing. */
router.get('/', function(req, res, next) {
  if (req.session.isLogin != 1) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
  let { pageCode, pageNumber } = req.query;
  pageCode = pageCode * 1 || 1; // 默认是第一页
  pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
  sql.find('sh1811', 'banner', {}).then(data => {
    const totalNumber = Math.ceil(data.length / pageNumber);
    data = data.splice((pageCode -  1) * pageNumber, pageNumber);
      res.render('banner', {
        activeIndex: 4,
        totalNumber,
        pageNumber,
        pageCode,
        data,
      });

  }).catch(err => {
    console.log(err);
  })
});

router.get('/add', function(req, res, next) {
  res.render('banner_add', {
    activeIndex: 4
  });
});

router.post('/addAction', function(req, res, next) {
  // { tel: tel}    { tel }
  // post 如何拿数据
  // const obj = req.body;
  let { imgid,imgurl } = req.body;
  imgid *= 1;
  sql.find('sh1811', 'banner', { imgid: imgid }).then(data => {
    if (data.length == 0) {
      // 表示没有查询到数据 --- 可以添加
      sql.insert('sh1811', 'banner', { imgid, imgurl })
        .then(() => {
          res.redirect('/banner');
        })
        .catch((err) => {
          res.redirect('/banner/add');
        })
    } else {
      // 该信息已存在
      res.redirect('/banner/add');
    }
  }).catch(err => {
    console.log(err);
    res.redirect('/banner/add');
  })
  // console.log(obj);

});

// 删除
router.get('/remove', function(req, res, next) {
  let { imgid } = req.query;
  console.log(imgid);
  imgid *=1;
  sql.remove('sh1811', 'banner', { imgid }).then(() => {
    res.redirect('/banner');
  }).catch((err) => {
    res.redirect('/banner');
  })
});

// 更新
router.post('/updateAction', function(req, res, next) {
  let { imgid,imgurl } = req.body;
  imgid *= 1;
  sql.update('sh1811', 'banner', 'updateOne', { imgid }, {$set: { imgurl }})
    .then(() => {
      res.redirect('/banner?pageCode=' + pageCode);
    }).catch(err => {
    res.redirect('/banner');
  })
});

//查询
router.get('/search', (req, res, next) => {
  let { imgid } = req.query;
  imgid *=1;
  console.log(imgid);
  sql.find('sh1811', 'banner', { imgid }).then(data => {
    // res.send(data)
    res.render('banner', {
      activeIndex: 4,
      totalNumber: 1,
      pageCode: 1,
      data,
      pageNumber: data.length,
    })
  })
});

//导入
// const xlsx = "D:/前端/假期项目/myapp/banner.xlsx";//本地地址
const xlsx = "/usr/local/node-pro/test/banner.xlsx";//服务器地址

router.get('/importBanners', (req, res, next) => {
  filemd.analysisdata(xlsx).then(obj => {
    // console.log(obj);
    const data = obj[0].data;
    let arr = [];
    data.map((item, index) => {
      if(index !== 0) {
        arr.push({
          imgid: item[0],
          imgurl: item[1]
        })
      }
    });
    // res.send(result)
    // 将商品信息存入到数据库
    sql.insert('sh1811', 'banner', arr).then(() => {
      //商品信息存储好后，返回到商品页面
      res.redirect('/banner')
    })
  })
});

// 导出
router.get('/exportBanners', (req, res, next) => {
  const _headers =  [
    {caption:'imgid',type:'number'},
    {caption:'imgurl',type:'string'}];

  sql.find('sh1811', 'banner', {}).then(data => {
    let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.imgid);
      arr.push(item.imgurl);
      alldata.push(arr);
    });
    const result = filemd.exportdata(_headers, alldata);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "banner.xlsx");
    res.end(result, 'binary');
  })
});
module.exports = router;
