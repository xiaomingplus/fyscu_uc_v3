/**
 * Created by lanhao on 15/10/17.
 */

var md5 = require('./node_modules/xiaolan/lib/tools')({}).md5;
var http = require('./libs/httpAgent');
http.headers.account = '18688124774';
http.headers.token = '85c77edf2dc2d04b0946d390b4eb41ad';
http.headers.appId = 1000;
var url = 'http://127.0.0.1:9528'

http.get(url+'/api/get',{
    'path':'/contact/tel'
}, function (e, r) {
   console.log(r.body);
});
