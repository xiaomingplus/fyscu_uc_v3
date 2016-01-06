/**
 * Created by lanhao on 15/10/17.
 */

var md5 = require('./node_modules/xiaolan/lib/tools')({}).md5;
var http = require('./libs/httpAgent');
http.headers.account = '18688124774';
http.headers.token = '9719fdb561280ee6b7a878b695d71cc4';
http.headers.appId = 1000;
http.headers.appKey = '29322987bd616276e8d4da9754cb0903';
var url = 'http://127.0.0.1:9528'

http.get(url+'/api',{
    'path':'/contact/tel',
    'data':{
        value:'112',
        note:'shit'
    }
}, function (e, r) {
   console.log(r.body);
});
