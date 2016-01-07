/**
 * Created by lanhao on 15/10/17.
 */

var md5 = require('./node_modules/xiaolan/lib/tools')({}).md5;
var http = require('./libs/httpAgent');
http.headers.account = '18688124774';
<<<<<<< HEAD
http.headers.appkey = '29322987bd616276e8d4da9754cb0903';
http.headers.token = '7fa36cf47e97dd70f7668f5a19c49095';
=======
http.headers.token = 'e266f102a916865455244be5f6008c31';
>>>>>>> develop
http.headers.appId = 1000;
http.headers.appKey = '29322987bd616276e8d4da9754cb0903';
var url = 'http://127.0.0.1:9528'

<<<<<<< HEAD
http.get(url+'/api/get',{
    'path':'/'
=======
http.put(url+'/api',{
    'path':'/contact/tel/0',
    'data':{
        value:'18688124774',
        note:'注册'
    }
>>>>>>> develop
}, function (e, r) {
   console.log(r.body.data);
});
