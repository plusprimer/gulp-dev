// mockjs参考文档 http://mockjs.com/examples.html

const Mock = require('mockjs');

exports.data = function () {
  return [{
    route: '/sidemenu',
    handle: function (req, res, next) {
      // req   请求头
      // res   响应的数据
      // res   请求头是模拟的后台数据返回告诉浏览器返回数据头，没有头的话数据出不来的
      res.writeHead(200, {
        "Content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      });
      var Random = Mock.Random;
      Random.integer();
      Random.string('lower', 4);
      Random.date('yyyy-MM-dd');
      var data = Mock.mock({
        "menuList|6": [{
          'menuNav': '@string()',
          "menuNavContent|1-5": [{
            'url': "index.html",
            'name': "@string('lower',4)",
            'id': "@integer(0,10)"
          }]
        }]
      });
      res.write(JSON.stringify(data));
      res.end(); //有开头有结尾不然数据依然无返回
    }
  },{
    route: '/menu',
    handle: function(req, res, next) {
      res.writeHead(200, {
        "Content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      });
      var Random = Mock.Random;
      Random.integer();
      Random.string('lower', 4);
      Random.date('yyyy-MM-dd');
      Random.image('200x100');
      var data = Mock.mock({
        "obj|4": [{
          "name": "@string()",
          "img": "@image(200x100)",
          'date': '@date',
          'test': 'tes',
          'som': 'okdwe'
        }]
      });
      res.write(JSON.stringify(data));
      res.end(); //有开头有结尾不然数据依然无返回
    }
  }]
}