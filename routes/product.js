var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var filemd = require('./../tool/file');
/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.isLogin != 1) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
  //分页效果
  let { pageCode, pageNumber } = req.query;
  pageCode = pageCode * 1 || 1; // 默认是第一页
  pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
  sql.find('sh1811', 'product', {}).then(data => {
    const totalNumber = Math.ceil(data.length / pageNumber);
    data = data.splice((pageCode -  1) * pageNumber, pageNumber);
    sql.distinct('sh1811', 'product', 'brand').then(brandArr => {
      res.render('product', {
        activeIndex: 3,
        totalNumber,
        pageNumber,
        pageCode,
        data,
        brandArr
      });
    })
  }).catch(err => {
    console.log(err);
  });
});

//添加商品信息
router.get('/add', function(req, res, next) {
  res.render('product_add', {
    activeIndex: 3
  });
});
router.post('/addAction', function(req, res, next) {
  // { tel: tel}    { tel }
  // post 如何拿数据
  // const obj = req.body;
  let { productId,productName,imgUrl,price,sale,color,count,brand } = req.body;
  productId *=1;
  price *=1;
  sale *=1;
  count *=1;

  sql.find('sh1811', 'product', { productId: productId }).then(data => {
    if (data.length == 0) {
      // 表示没有查询到数据 --- 可以添加该商品
      sql.insert('sh1811', 'product', { productId,productName,imgUrl,price,sale,color,count,brand })
        .then(() => {
          res.redirect('/product');
        })
        .catch((err) => {
          res.redirect('/product/add');
        })
    } else {
      // 该商品已存在
      res.redirect('/product/add');
    }
  }).catch(err => {
    console.log(err);
    res.redirect('/product/add');
  })
  // console.log(obj);
});
//商品信息路径
// const xlsx = "D:/前端/假期项目/myapp/product.xlsx";//本地地址
const xlsx = "/usr/local/node-pro/test/product.xlsx";//服务器地址

//导入商品信息
router.get('/importProduct', (req, res, next) => {
  filemd.analysisdata(xlsx).then(obj => {
		// console.log(obj);
    const data = obj[0].data;
    let arr = [];
    data.map((item, index) => {
      if(index !== 0) {
        arr.push({
          productId: item[0],
          productName: item[1],
          imgUrl: item[2],
          price: item[3],
          sale: item[4],
          color: item[5],
          count: item[6],
          brand: item[7]
        })
      }
    });
		// res.send(result)
    // 将商品信息存入到数据库
		sql.insert('sh1811', 'product', arr).then(() => {
		  //商品信息存储好后，返回到商品页面
			res.redirect('/product')
		})
	})
});

//导出商品信息
router.get('/exportProduct', (req, res, next) => {
  const _headers =  [
    {caption:'productId',type:'number'},
    {caption:'productName',type:'string'},
    {caption:'imgurl',type:'string'},
    {caption:'price',type:'number'},
    {caption:"sale",type:"number"},
    {caption:'color',type:'string'},
    {caption:'count',type:'number'},
    {caption:'brand',type:'string'},
  ];


  sql.find('sh1811', 'product', {}).then(data => {
    let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.productId);
      arr.push(item.productName);
      arr.push(item.imgUrl);
      arr.push(item.price);
      arr.push(item.sale);
      arr.push(item.color);
      arr.push(item.count);
      arr.push(item.brand);
      alldata.push(arr);
    });
    const result = filemd.exportdata(_headers, alldata);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "product.xlsx");
    res.end(result, 'binary');
  })
});

//更改商品信息
router.post('/updateAction', function(req, res, next) {
  let { productId,productName,imgUrl,price,sale,color,count,brand,pageCode } = req.body;
  productId *=1;
  price *=1;
  sale *=1;
  count *=1;
  pageCode *=1;
  console.log(req.body);
  sql.update('sh1811', 'product', 'updateOne', { productId }, {$set: { productName,imgUrl,price,sale,color,count,brand }})
    .then(() => {
      res.redirect('/product?pageCode=' + pageCode);

    }).catch(err => {
    res.redirect('/product');
  })
});

//删除商品信息
router.get('/remove', function(req, res, next) {
  let { productId } = req.query;
  console.log(req.query);
  productId *=1;
  sql.remove('sh1811', 'product', { productId }).then(() => {
    res.redirect('/product');
  }).catch((err) => {
    res.redirect('/product');
  })
});

//查询====》模糊查询----商品品牌查询
router.get('/search', (req, res, next) => {
  const { brand } = req.query;
  console.log(req.query);
  console.log(brand);
  sql.find('sh1811', 'product', { brand: eval('/'+brand+'/') }).then(data => {
    // res.send(data)
    console.log(data);
    sql.distinct('sh1811', 'product', 'brand').then(brandArr => {
      res.render('product', {
        activeIndex: 3,
        totalNumber:1,
        pageNumber:data.length,
        pageCode:1,
        data,
        brandArr
      });
    })
  })
});

router.get('/brandSearch', (req, res, next) => {
  let { brand } = req.query;
  sql.find('sh1811', 'product', { brand }).then(data => {
    // res.send(data)
    sql.distinct('sh1811', 'product', 'brand').then(brandArr => {
      res.render('product', {
        activeIndex: 3,
        totalNumber: 1,
        pageCode: 1,
        data,
        pageNumber: data.length,
        brandArr
      })
    })
  })
});
//排序
router.get('/sort', (req, res, next) => {
  let { type, num } = req.query;
  let sortData = {};
  sortData[type] = num * 1;
  sql.sort('sh1811', 'product', sortData).then(data => {
    // res.send(data)
    sql.distinct('sh1811', 'product', "price").then(brandArr => {
      res.render('product', {
        activeIndex: 3,
        totalNumber: 1,
        pageCode: 1,
        data,
        pageNumber: data.length,
        brandArr
      })
    })
  })
});

router.get('/distinct', (req, res, next) => {
  sql.distinct('sh1811', 'product', 'brand').then(brandArr => {
    res.send(brandArr);
  })
});
module.exports = router;
