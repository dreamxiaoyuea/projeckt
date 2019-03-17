var xlsx = require('node-xlsx');
var nodeExcel = require('excel-export');

const filemd = {
  analysisdata (path) {
    return new Promise((resolve, reject) => {
      // 解析excel文件
      const obj = xlsx.parse(path);
      resolve(obj); // obj为buffer类型
    })
  },
  usersfilterdata (data) {
    let arr = [];
    data.map((item, index) => {
      if(index !== 0) {
        arr.push({
          tel: item[0],
          nickname: item[1],
          password: item[2],
          age: item[3]
        })
      }
    })
    return arr;
  },
  exportdata (_headers, rows) {
    var conf ={};
    conf.name = "mysheet";
    conf.cols = [];
    for(var i = 0; i < _headers.length; i++){
        var col = {};
        col.caption = _headers[i].caption;
        col.type = _headers[i].type;
        conf.cols.push(col);
    }
    conf.rows = rows;
    var result = nodeExcel.execute(conf);
    return result;
    // // console.log('11111', data)
    // let config = {};
    // // config.stylesXmlFile = "styles.xml";
    // config.name = '用户';
    // let alldata = new Array();
    // data.map((item, index) => {
    //   let arr = [];
    //   arr.push(item.tel);
    //   arr.push(item.nickname);
    //   arr.push(item.password);
    //   alldata.push(arr);
    // })
    // config.cols = [{
    //     caption: 'tel',
    //     type:'string'
    //   },
    //   {
    //     caption: 'nickname',
    //     type:'string'
    //   },
    //   {
    //     caption: 'password',
    //     type:'string'
    //   }]
    // config.rows = alldata;//填充数据
    // var result = nodeExcel.execute(config);
    // res.send(config)
    // // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    // // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    // // res.end(result, 'binary');
  }
}

module.exports = filemd;