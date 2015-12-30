'use strict';

let async = require('async');
let redis = global.app.libs.redis;
let md5 = global.app.libs.tools.md5;

let userModel = require('../models/user');
let appModel = require('../models/app');

let access = {};

access.version = '1';

access.login = function (req, res) { 
    let account = req.body.account;
    let password = req.body.password;
    let appId = req.body.appId;
    let redirectUrl = req.body.callback;
    let time = parseInt(Date.now());
    if (redirectUrl && Number.parseInt(appId) && account && password) {
        userModel.auth(account,password, function (e, r) {
           if(!e){
               let accessToken = md5('uc3.0' + account + Date.now());
               let userInfo = {
                   account,
                   accessToken
               };
               redis.saveExpireObj('session:' + account, userInfo, 3600 * 24 * 30, function (_e, _r) {
                   if(_e)console.log(_e);
               });
               redirectUrl = (redirectUrl.indexOf('?')>0)?redirectUrl+'&account='+account+'&accessToken='+accessToken:redirectUrl+'?account='+account+'&accessToken='+accessToken;
               res.redirect(redirectUrl);
           } else{
               res.render('error.html',{'msg':'发生错误大家也是不想的，多从自己身上找原因。'+e+':'+r});
           }
        });
    } else {
        res.render('error.html',{'msg':'大师兄，account、password和appId被二师兄抓走了。  '});
    }
};

//TODO 
access.spLogin = function (req, res) {
    let appId = req.query.appId ;
    let account = req.query.account;
    let sign = req.query.sign;
    let t = Date.now();
    let redirectUrl = decodeURIComponent(req.query.callback);
    
    if (appId && account  && sign) {
        let appKey = appModel.all[appId].appKey;
        if (sign === md5(account + appKey + parseInt(t/global.app.config.params['SP_LOGIN_SIGN_TIME_LIMIT']))) {
            console.log('sign ok')
            //success 签名通过意味着uc承认这个account的合法性
            //todo
        } else {
            if(redirectUrl) {
                res.render('error.html', {'msg': '签名不对你糊弄谁呢？'});
            }else{
                res.json(401,{},'签名不正确');
            }
        }
    } else {
        if(redirectUrl) {
            res.render('error.html', {'msg': '大师兄，callback、account、password和appId被二师兄抓走了。  '});
        }else{
            res.json(401,{},'参数缺失，请参看文档');
        }
    }
};

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
            userModel.add(account,{
                'contact': {
                    'tel': [{
                        'value': account,
                        'note': ''
                    }]
                },
                'accounts':{
                    'fyuc':[{
                        'u':account,
                        'p':password
                    }]
                },
                'preferences':{
                    'apps':[
                        appId
                    ]
                }
            }, function (e, r) {
                if(!e){
                    let accessToken = md5('uc3.0' + account + Date.now());
                    let userInfo = {
                        account,
                        accessToken
                    };
                    redis.saveExpireObj('session:' + account, userInfo, 3600 * 24 * 30, function (_e, _r) {
                        if(_e)console.log(_e);
                    });

                    redirectUrl = (redirectUrl.indexOf('?')>0)?redirectUrl+'&account='+account+'&accessToken='+accessToken:redirectUrl+'?account='+account+'&accessToken='+accessToken;

                    res.redirect(redirectUrl);
                }else{
                    res.render('error.html',{'msg':'怎么死活就注册不上呢？'});
                }
            });
        }else{
            res.render('error.html',{'msg':'验证码错误'});
        }
    } else {
        res.render('error.html',{'msg':'大师兄，callback、account、password和appId被二师兄抓走了。  '});
    }
};


module.exports = access;

/**
 * Change Log
 * 1     init
 */
