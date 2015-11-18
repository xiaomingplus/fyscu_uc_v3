/**
 * Created by lanhao on 15/10/17.
 */
var request = require('request');
var md5 = require('./node_modules/xiaolan/lib/tools')({}).md5;
var nodedb = require('nodedb')({
    'path': './db'
});
function http_post(url, data) {
    request.post({
        'url': url,
        'json': data
    }, function (e, r) {
        console.log(e, r.body);
    });
};
//http get
function http_get(url, data) {
    if (data) {
        url += '?';
        for (var k in data) {
            url += k + '=' + data[k] + '&';
        }
    }
    //console.log(url);

    request.get(url, function (e, r) {
        console.log(e, r ? r.body : null);
    });

};
// db06c78d1e24cf70

var url = 'http://121.41.85.236:9527';
http_get(url+'/user/info',{
    appId:1000,
    appKey:'db06c78d1e24cf70',
    uid:1135,
    accessToken:'7650260b795ddec1f4689fc021aa91a2'
})
//http_post(url+'/user/setter',{
//    appId:1000,
//    appKey:'db06c78d1e24cf70',
//    uid:1135,
//    accessToken:'7650260b795ddec1f4689fc021aa91a2',
//    path:'/fyvip',
//    data:{
//        grade:2007,
//        level:3
//    },
//    index:['grade','level']
//})
//var t = Date.now();
//t = parseInt(t/(1000 * 300));
//var appId = 1000;
//var appKey = 'db06c78d1e24cf70';
//var sign = md5('superLan'+appKey+t);
//nodedb.get('/1039', function (e, r) {
//    console.log(e,r);
//});
//nodedb.query('/fyvip/grade',2007, function (e, r) {
//    console.log(r[0].data.fyvip)
//});
//http_post(url+'/user/setter',{
//    'appId':1000,
//    'appKey':'db06c78d1e24cf70',
//    'uid':1135,
//    'accessToken':'00e12e0ef831d86d40f15490f2e39802',
//    'path':'/fyvip',
//    'data':{
//        'level':1
//    },
//    'index':['level']
//})
//http_get(url+'/user/info',{
//        'appId':1000,
//    'appKey':'db06c78d1e24cf70',
//    'uid':1135,
//    'accessToken':'00e12e0ef831d86d40f15490f2e39802'
//});
//http_get('/access/spLogin',{
//    appId:appId,
//    account:'superLan',
//    sign:sign
//})

//var db = require('./node_modules/xiaolan/lib/mysql')({
//  "host": "121.41.85.236",
//  "port": "3306",
//  "user": "ciwei",
//  "password": "123456",
//  "database": "platform_ng"
//});
//
//t = parseInt(t/1000);
//db.query({
//  sql:'select t1.*,t2.username,t2.password from fyscu_platform.uc_user_info t1 left join fyscu_platform.uc_account t2 on t1.uid=t2.id where t2.type=1'
//}, function (e, r) {
//  console.log(r.length);
//  for(var k in r){
//    var i = r[k];
//    (function(item){
//      var u = item.uid;
//      nodedb.put('/'+u+'/tel',{
//        'value':item.tel
//      },['value'], function (e1, r1) {
//
//      });
//      db.query({
//        sql:'insert into platform_ng.uc_account set account="'+item.username+'",password="'+item.password+'",uid="'+u+'",createAt='+t
//      }, function (e2, r2) {
//        console.log(e2,r2);
//      });
//    })(i);
//  }
//});

