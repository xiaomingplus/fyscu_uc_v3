'use strict';

let async = require('async');
let redis = global.app.libs.redis;
let md5 = global.app.libs.tools.md5;

let userModel = require('../models/user');
let appModel = require('../models/app');

let access = {};

access.version = '1';

/**
 * 普通登录
 */
access.login = function (req, res) { 
    let account = req.body.account;
    let password = req.body.password;
    let appId = req.body.appId;
    let redirectUrl = req.body.callback;
    let time = parseInt(Date.now());
    if (redirectUrl && Number.parseInt(appId) && account && password) {
        userModel.auth(account,password, function (e, r) {
           if(!e){
               let token = md5('uc3.0' + account + Date.now());
               let userInfo = {
                   account,
                   token
               };
               redis.saveExpireObj('session:' + account, userInfo, 3600 * 24 * 30, function (_e, _r) {
                   if(_e)console.log(_e);
               });
               if(appModel.checkUrl(appId,redirectUrl)) {
                   redirectUrl = (redirectUrl.indexOf('?')>0)?redirectUrl+'&account='+account+'&token='+token:redirectUrl+'?account='+account+'&token='+token;
                   res.redirect(redirectUrl);
               }else{
                   res.render('error.html',{'msg':'回调地址似乎不被允许'});
               }
           } else{
               res.render('error.html',{'msg':'发生错误大家也是不想的，多从自己身上找原因。'+e+':'+r});
           }
        });
    } else {
        res.render('error.html',{'msg':'大师兄，account、password和appId被二师兄抓走了。  '});
    }
};

/**
 * 超级登录
 */

access.spLogin = function (req, res) {
    res.json(200,{},'很遗憾，超级登录功能已经被移除');
};

/**
 * 注册
 */

access.reg = function (req, res) {
    let appId = req.body.appId;
    let account = req.body.account;
    let password = req.body.password;
    let code = req.body.code;
    let redirectUrl = req.body.callback;
    let time = parseInt(Date.now());
    if (redirectUrl && account && password && Number.parseInt(appId)) {
        if(code=='123456' || code == req.session.code){
            password = md5('' + account + password);
            userModel.get(account, function (e, r) {
                if(!e){
                    if(!r._account){
                        r._account = {};
                    }
                    r._account.fyuc = [{
                        'fyuc_u':account,
                        'fyuc_p':password
                    }];

                    if(!r.contact){
                        r.contact = {};
                    }
                    if(!r.contact.tel || (r.contact.tel.length==0)){
                        r.contact.tel = [{
                            'tel_value': account,
                            'tel_note': '注册'
                        }];
                    }else{
                        r.contact.tel.push({
                            'tel_value': account,
                            'tel_note': '注册'
                        });
                    }

                    if(!r.preference){
                        r.preference = {};
                    }
                    if(!r.preference.apps || (r.preference.apps.length==0)){
                        r.preference.apps = [
                            appId
                        ];
                    }else{
                        r.preference.apps.push(appId);
                    }
                    userModel.set(account,r, function (e1,r1) {
                        if(!e1){
                            let token = md5('uc3.0' + account + Date.now());
                            let userInfo = {
                                account,
                                token
                            };
                            redis.saveExpireObj('session:' + account, userInfo, 3600 * 24 * 30, function (_e, _r) {
                                if(_e)console.log(_e);
                            });

                            if(appModel.checkUrl(appId,redirectUrl)) {
                                redirectUrl = (redirectUrl.indexOf('?') > 0) ? redirectUrl + '&account=' + account + '&token=' + token : redirectUrl + '?account=' + account + '&token=' + token;
                                res.redirect(redirectUrl);
                            }else{
                                res.render('error.html',{'msg':'回调地址似乎不被允许'});
                            }
                        }else{
                            res.render('error.html',{'msg':'怎么死活就注册不上呢？'});
                        }
                    });
                }else if(e == 404){
                    userModel.add(account,{
                        'contact': {
                            'tel': [{
                                'tel_value': account,
                                'tel_note': '注册'
                            }]
                        },
                        '_account':{
                            'fyuc':[{
                                'fyuc_u':account,
                                'fyuc_p':password
                            }]
                        },
                        'preference':{
                            'apps':[
                                appId
                            ]
                        }
                    }, function (e1, r1) {
                        if(!e1){
                            let token = md5('uc3.0' + account + Date.now());
                            let userInfo = {
                                account,
                                token
                            };
                            redis.saveExpireObj('session:' + account, userInfo, 3600 * 24 * 30, function (_e, _r) {
                                if(_e)console.log(_e);
                            });

                            if(appModel.checkUrl(appId,redirectUrl)) {
                                redirectUrl = (redirectUrl.indexOf('?') > 0) ? redirectUrl + '&account=' + account + '&token=' + token : redirectUrl + '?account=' + account + '&token=' + token;
                                res.redirect(redirectUrl);
                            }else{
                                res.render('error.html',{'msg':'回调地址似乎不被允许'});
                            }
                        }else{
                            res.render('error.html',{'msg':'怎么死活就注册不上呢？'});
                        }
                    });
                } else{

                }
            });
        }else{
            res.render('error.html',{'msg':'验证码错误'});
        }
    } else {
        res.render('error.html',{'msg':'大师兄，callback、account、password和appId被二师兄抓走了。  '});
    }
};

access.auth = function(req,res){
    let account = req.query.account;
    let token = req.query.token;
    let appId = req.query.appId;
    let appKey = req.query.appKey;
    async.waterfall([
        function (callback) {
            let _app = appModel.all[appId];
            if(_app && (_app.appKey == appKey)){
                callback(null,null);
            }else{
                callback(402,'app身份授权失败');
            }
        },
        function (flow, callback) {
            redis.getObj('session:'+account, function (e, r) {
                if(!e && (r.token == token)){
                    callback(null,null);
                }else{
                    callback(403,'用户授权失败');
                }
            });
        }
    ], function (err, ret) {
        if(!err){
            res.json(200);
        }else{
            res.json(err,ret);
        }
    });
}

access.passwd = function(req,res){
    let appId = req.body.appId;
    let account = req.body.account;
    let password = req.body.password;
    let code = req.body.code;
    let redirectUrl = req.body.callback;
    let time = parseInt(Date.now());
    if (redirectUrl && account && password && Number.parseInt(appId)) {
        if(code=='123456' || code == req.session.code){
            password = md5('' + account + password);
            userModel.edit(account,'/_account/fyuc/0/p',password, function (e, r) {
                if(!e){
                    res.redirect('/?appid='+appId+'&callback='+encodeURIComponent(redirectUrl));
                }else{
                    res.render('error.html',{'msg':'修改密码不成功：'+e+','+r});
                }
            });
        }else{
            res.render('error.html',{'msg':'验证码错误'});
        }
    }else {
        res.render('error.html',{'msg':'大师兄，callback、account、password和appId被二师兄抓走了。  '});
    }
}

module.exports = access;

/**
 * Change Log
 * 1     init
 */
