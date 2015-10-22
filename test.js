/**
 * Created by lanhao on 15/10/17.
 */
var request = require('request');

function http_post(url, data) {
  request.post({
    'url': url,
    'form': data
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
  console.log(url);
  request.get(url, function (e, r) {
    console.log(e, r ? r.body : null);
  });
};

var url = 'http://127.0.0.1:9527';
//http_post(url+'/access/login',{
//  'account':'test',
//  'password':'123456'
//})
//http_get(url+'/user/info/tel/0',{
//  'uid':'1135',
//  'accessToken':'227395f01a3686cfc41747dbdae60e55'
//});
//
//var db = require('./node_modules/xiaolan/lib/mysql')({
//  "host": "121.41.85.236",
//  "port": "3306",
//  "user": "ciwei",
//  "password": "123456",
//  "database": "platform_ng"
//});
//db.query('select * from platform_ng.app_info', function (e, r) {
//  console.log(r);
//});
//var nodedb = require('./node_modules/nodedb')({
//  'path': './db'
//});
//nodedb.query('18688124774', function (e, r) {
//  console.log(e,r);
//});
//console.log(nodedb);
//id: 30,
//  uid: 1033,
//  username: 'oHBDCjiVUYkt4RT92Y7zvfAKVgJs',
//  tel: '15680782256',
//  qq: null,
//  email: null,
//  wechat_id: 'oHBDCjiVUYkt4RT92Y7zvfAKVgJs',
//  qq_openid: null,
//  is_vip: 0,
//  gender: 0
//var t = parseInt(Date.now()/1000);
//db.query({
//  sql:'select t1.*,t2.username,t2.password from fyscu_platform.uc_user_info t1 left join fyscu_platform.uc_account t2 on t1.uid=t2.id where t2.type=1'
//}, function (e, r) {
//  console.log(r.length);
//  for(var k in r){
//    var i = r[k];
//    (function(item){
//      var u = item.uid;
//      nodedb.put('/'+u+'/tel/0',{
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
