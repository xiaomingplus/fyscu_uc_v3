'use strict';

let async = require('../node_modules/async');

let nodedb = require('../node_modules/nodedb')({
  'path': './db'
});

let db = global.app.libs.mysql;
let redis = global.app.libs.redis;
let md5 = global.app.libs.tools.md5;
let appInfo = global.appinfo;

let access = {};

access.version = '1';

access.login = function (req, res) {
  let account = req.body.account;
  let password = req.body.password;
  let appId = req.body.appId || 1000;
  if(appId && account && password){
    let time = parseInt(Date.now());
    db.query({
      sql:'select * from uc_account where account=:account limit 1',
      params:{
        'account':account
      }
    }, function (e, r) {
      if(!e){
        if(r && r.length){
          if(r[0].password === md5(account+password)) {
            //login
            let uid = r[0].uid;
            if(uid) {
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

                  if(appInfo[appId]){
                    var url = appInfo[appId].callback;
                    res.redirect(url+'?uid='+uid+'&accessToken='+accessToken);
                  }else{
                    res.json(400,{},'appId错误');
                  }
                } else {
                  req.session['accountId'] = r[0].id;
                  res.redirect('/access/bindTel?appId='+appId);
                }
              });
            }else{
              req.session['accountId'] = r[0].id;
              res.redirect('/access/bindTel?appId='+appId);
            }
          }else{
            res.json(403,{},'密码或帐号不正确');
          }
        }else{
          res.json(403,{},'密码或帐号不正确');
        }
      }else{
        console.log(e);
        res.json(500,{},'mysql error');
      }
    });
  }else{
    res.json(401);
  }
};

//TODO 
access.tpLogin = function(req,res){
  let appId = req.body.appId || 1000;
  let account = req.body.account;
  let tel = req.body.tel;
  let sign = req.body.sign;
  let t = req.body.t;

  if(appId && account && tel && sign){
    let appKey = appInfo[appId].appkey;
    if(sign === md5(account+appKey+tel+t)){
      //success
      db.query({
        sql:'select * from uc_account where account=:account limit 1',
        params:{
          'account':account
        }
      }, function (e, r) {
        if(!e){
          if(r && r.length){
            // login
            let uid = r[0].uid;
            if(uid) {
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

                  if(appInfo[appId]){
                    var url = appInfo[appId].callback;
                    res.redirect(url+'?uid='+uid+'&accessToken='+accessToken);
                  }else{
                    res.json(400,{},'appId错误');
                  }
                } else {
                  req.session['accountId'] = r[0].id;
                  res.redirect('/access/bindTel?appId='+appId);
                }
              });
            }else{
              req.session['accountId'] = r[0].id;
              res.redirect('/access/bindTel?appId='+appId);
            }
          } else{
            // reg
            req.body.password = sign;
            access.reg(req,res);
          }
        }else{
          console.log(e);
          res.json(500,{},'mysql error');
        }
      });
    }else{
      res.json(400);
    }
  }else{
    res.json(401);
  }
};

access.reg = function(req,res){
  let appId = req.body.appId || 1000;
  let account = req.body.account;
  let password = req.body.password;
  let time = parseInt(Date.now());
  if(account && password && appId){
    password = md5(''+account+password);
    db.query({
      'sql':'insert into uc_account set account=:account,password=:password,createAt=:createAt',
      'params':{
        'account':account,
        'password':password,
        'createAt':time
      }
    }, function (e, r) {
      if(!e){
        req.session['accountId'] = r?r.insertId:0;
        res.redirect('/access/bindTel');
      }else{
        console.log(e);
        res.json(500,{},'mysql error');
      }
    });
  }else{
    res.json(401);
  }
};

access.bindTel = function(req,res){
  if(req.method=='GET'){
    res.render('bindTel.html');
  }else {
    let appId = req.body.appId || 1000;
    let tel = req.body.tel;
    let code = req.body.code;
    let accountId = req.session.accountId;
    console.log(tel,code,accountId,appId);
    if(tel && code && accountId && appId){
      if(code == req.session.code || code == '111111'){
        async.waterfall([
          function (callback) {
            nodedb.query(tel, function (e, r) {
              if(!e){
                if(r && r.length){
                  //已有用户
                  let uid = r[0].uid;
                  callback(null,uid);
                }else{
                  //new nodedb user
                  let uid = accountId;
                  nodedb.put('/'+uid+'/tel/0',{
                    'value':tel
                  },['value'], function (e1, r1) {
                    if(!e1){
                      callback(null,uid);
                    }else{
                      console.log(e1,r1);
                      callback(501,'nodedb error')
                    }
                  });
                }
              }else{
                console.log(e,r);
                callback(501,'nodedb error')
              }
            });
          },
          function (flow, callback) {
            let uid = flow;
            callback(null,uid);
            db.query('update uc_account set uid='+uid+' where id='+accountId, function (_e, _r) {
              if(_e)console.log(_e);
            });
          }
        ], function (err, ret) {
          if(err){
            res.json(err,{},ret);
          }else{
            let uid = ret;
            let accessToken = md5('uc3.0' + uid + Date.now());
            let userInfo = {
              uid,
              accessToken
            };
            redis.saveExpireObj('session:' + uid, userInfo, 3600 * 24 * 30, function (e2, r2) {
              console.log(e2, r2);
            });

            if(appInfo[appId]){
              var url = appInfo[appId].callback;
              res.redirect(url+'?uid='+uid+'&accessToken='+accessToken);
            }else{
              res.json(400,{},'appId错误');
            }
          }
        });
      }else{
        res.json(400,{},'验证码错误');
      }
    }else{
      res.json(401);
    }
  }
};

module.exports = access;

/**
 * Change Log
 * 1     init
 */
