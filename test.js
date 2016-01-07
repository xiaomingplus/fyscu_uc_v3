/**
 * Created by lanhao on 15/10/17.
 */

var md5 = require('./node_modules/xiaolan/lib/tools')({}).md5;
var http = require('./libs/httpAgent');

http.headers.account = '18688124774';
http.headers.token = 'e266f102a916865455244be5f6008c31';

http.headers.appId = 1000;
http.headers.appKey = '29322987bd616276e8d4da9754cb0903';

var url = 'http://127.0.0.1:9528'


http.get(url+'/access/auth?appId=1000&token=e714921edcc0209226d7b434fc421f47&appKey=29322987bd616276e8d4da9754cb0903&account=18688124774',{}, function (e, r) {
   console.log(r.body);

});
