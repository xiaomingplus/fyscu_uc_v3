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
    let appId = req.query.appId || 1000;
    let account = req.query.account;
    let sign = req.query.sign;
    let t = Date.now();

    if (appId && account  && sign) {
        let appKey = appInfo[appId].appkey;
      
        if (sign === md5(account + appKey + parseInt(t/(1000 * 300)))) {
            console.log('sign ok')
            //success
            db.query({
                sql: 'select * from uc_account where account=:account limit 1',
                params: {
                    'account': account
                }
            }, function (e, r) {
                if (!e) {
                    if (r && r.length) {
                        // login
                        let uid = r[0].uid;
                        if (uid) {
                            nodedb.get('/' + uid, function (e1, r1) {
                                if (r1) {
                                    let accessToken = md5('uc3.0' + uid + Date.now());
                                    let userInfo = {
                                        account,
                                        uid,
                                        accessToken
                                    };
                                    redis.saveExpireObj('session:' + uid, userInfo, 3600 * 24 * 30, function (e2, r2) {
                                        console.log(e2, r2);
                                    });

                                    if (appInfo[appId]) {
                                        var url = appInfo[appId].callback;

                                        res.redirect(url + '?uid=' + uid + '&accessToken=' + accessToken);
                                    } else {
                                        res.json(400, {}, 'appId错误');
                                    }
                                } else {
                                    req.session['accountId'] = r[0].id;
                                    res.redirect('/access/bindTel?appId=' + appId);
                                }
                            });
                        } else {
                            req.session['accountId'] = r[0].id;
                            res.redirect('/access/bindTel?appId=' + appId);
                        }
                    } else {
                        // reg
                        req.body = req.query;
                        req.body.password = sign;
                        access.reg(req, res);
                    }
                } else {
                    console.log(e);
                    res.json(500, {}, 'mysql error');
                }
            });
        } else {
            res.json(400);
        }
    } else {
        res.json(401);
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

access.bindTel = function (req, res) {
    if (req.method == 'GET') {
        res.render('bindTel.html',{'license':global.app.config.license});
    } else {
        let appId = req.body.appId || 1000;
        let tel = req.body.tel;
        let code = req.body.code;
        let accountId = req.session.accountId;
        console.log(tel, code, accountId, appId);
        if (tel && code && accountId && appId) {
            if (code == req.session.code || code == '111111') {
                async.waterfall([
                    function (callback) {
                        nodedb.query('/tel',tel, function (e, r) {
                            if (!e) {
                                if (r && r.length) {
                                    //已有用户
                                    let uid = r[0].uid;
                                    callback(null, uid);
                                } else {
                                    //new nodedb user
                                    let uid = accountId;
                                    nodedb.put('/' + uid + '/tel', {
                                        'value': tel
                                    }, ['value'], function (e1, r1) {
                                        if (!e1) {
                                            callback(null, uid);
                                        } else {
                                            console.log(e1, r1);
                                            callback(501, 'nodedb error')
                                        }
                                    });
                                }
                            } else {
                                console.log(e, r);
                                callback(501, 'nodedb error')
                            }
                        });
                    },
                    function (flow, callback) {
                        let uid = flow;
                        callback(null, uid);
                        db.query('update uc_account set uid=' + uid + ' where id=' + accountId, function (_e, _r) {
                            if (_e)console.log(_e);
                        });
                    }
                ], function (err, ret) {
                    if (err) {
                        res.json(err, {}, ret);
                    } else {
                        let uid = ret;
                        let accessToken = md5('uc3.0' + uid + Date.now());
                        let userInfo = {
                            uid,
                            accessToken
                        };
                        redis.saveExpireObj('session:' + uid, userInfo, 3600 * 24 * 30, function (e2, r2) {
                            console.log(e2, r2);
                        });

                        if (appInfo[appId]) {
                            var url = appInfo[appId].callback;
                            res.redirect(url + '?uid=' + uid + '&accessToken=' + accessToken);
                        } else {
                            res.json(400, {}, 'appId错误');
                        }
                    }
                });
            } else {
                res.json(400, {}, '验证码错误');
            }
        } else {
            res.json(401);
        }
    }
};

module.exports = access;

/**
 * Change Log
 * 1     init
 */
