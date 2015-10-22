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
  let appId = req.body.appId;
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
                  res.redirect('/access/bindTel?appId='+appId);//todo
                }
              });
            }else{
              res.redirect('/access/bindTel?appId='+appId); //todo
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

access.reg = function(req,res){
  let account = req.body.account;
  let password = req.body.password;
  if(account && password){
    res.json(200,req.body);
  }else{
    res.json(401);
  }
};

access.bindTel = function(req,res){
  if(req.method=='GET'){
    res.render('bindTel.html',{
      'appId':req.query.appId
    });
  }else {
    let tel = req.body.tel;
    let code = req.body.code;
    res.json(200,req.body);
  }
};

module.exports = access;

/**
 * Change Log
 * 1     init
 */
