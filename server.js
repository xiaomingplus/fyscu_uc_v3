/**
 * Created by lanhao on 15/5/17.
 */

//引入配置文件
var config = require('./config/config');

//引入小蓝框架
var xiaolan = require('xiaolan')(config);

//启动监听服务
xiaolan.createServer();

//global.app.libs.mysql.query('select * from app_info', function (e,r) {
//  if(r.length){
//    global.appinfo = {};
//    for(var k in r){
//      global.appinfo[''+r[k].id] = r[k];
//    }
//  }
//});