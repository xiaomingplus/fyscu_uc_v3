'use strict';

var httpAgent = require('./libs/httpAgent');

let fyuc = {};

const UC_HOST = 'http://121.41.85.236:9528';

fyuc.appId = undefined;

fyuc.appKey = undefined;


fyuc.init = function (appId, appKey) {
    fyuc.appId = appId;
    fyuc.appKey = appKey;
    return fyuc;
}

fyuc.loginUrl = function (redirectUrl) {
    return UC_HOST+'/?appId='+fyuc.appId+'&callback='+encodeURIComponent(redirectUrl);
}

fyuc.processCallback = function(query,cb){
    let account = (query && query.account)?query.account:null;
    let token = (query && query.token)?query.token:null;
    if(account && token){
        httpAgent.get(UC_HOST+'/access/auth?account='+account+'&token='+token+'&appId='+fyuc.appId+'&appKey='+fyuc.appKey,{}, function (e, r) {
            if(!e && r && r.body &&  (r.body.code==200)){
                httpAgent.headers.account = account;
                httpAgent.headers.token = token;
                httpAgent.headers.appId = fyuc.appId;
                httpAgent.headers.appKey = fyuc.appKey;
                cb(null,true);
            }else{
                cb(e,(r && r.body)?r.body:null);
            }
        });
    }else {
        cb(401, 'arguments error');
    }
}

fyuc.getUserInfo = function (branch,cb) {
    httpAgent.get(UC_HOST+'/api',{
        'path':branch
    }, function (e, r) {
        if(!e && r && r.body &&  (r.body.code==200)){
            cb(null,r.body.data);
        }else{
            cb(e,(r && r.body)?r.body:null);
        }
    });
}



module.exports = fyuc.init;

// USAGE
// 使用以下方式初始化fyuc，参数为 appId  、  appKey
// var fyuc = require('./index')(1000,'{appKey}');
//
// 生成一个登录链接，替换你原来的登录地址，注意你的回调地址
// var loginUrl = fyuc.loginUrl('{回调地址}');
//
// 针对你提供的回调地址，你需要实现对应的回调逻辑，
// 参数会采取GET方法传递，所以你要将req.query作为第一个参数传进去
// processCallback 会自动帮你验证token合法性，
// fyuc.processCallback(req.query, function (e, r) {
//    if(!e){
//        //之后就可以获取数据了，
//        fyuc.getUserInfo('/contact/tel', function (ee, rr) {
//            console.log(ee,rr);
//        });
//    }
// });
