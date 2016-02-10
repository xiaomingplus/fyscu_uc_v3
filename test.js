/**
 * Created by lanhao on 15/10/17.
 */

var md5 = require('./node_modules/xiaolan/lib/tools')({}).md5;
var http = require('./libs/httpAgent');

http.headers.account = '18688124774';
http.headers.token = 'e266f102a916865455244be5f6008c31';

http.headers.appId = 1000;
http.headers.appKey = '29322987bd616276e8d4da9754cb0903';

var url = 'http://127.0.0.1:9528';

//http.post('http://lumen.tff.com/authentication',{
//    account:'114',
//    password:'123456'
//    //platform:'PC',
//    ////email:'test@tff.com',
//    //'cell_phone':'114',
//    //chinese_name:'研发测试账号',
//    //first_name:'Test',
//    //last_name:'Tour',
//    //password:'123456'
//}, function (e, r) {
//    console.log(r.headers['content-type'],r.body);
//});

//require('request').post('http://payment.blues.tff.com/forward/ALIPAY',{
//    trans_id:'201602021006040604221999'
//}, function (e, r) {
//    console.log(e,r.body?r.body:r);
//
//});