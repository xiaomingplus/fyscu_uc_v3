/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
let nodedb = require('../node_modules/nodedb')({
  'path': './db'
});

let redis = global.app.libs.redis;

let User = {};

User.info = function (req, res) {
  let uid = req.query.uid;
  let accessToken = req.query.accessToken;
  User._filter(uid,accessToken, function (e, r) {
    if(!e){
      nodedb.get('/'+uid+(req.params[2]||''), function (e1, r1) {
        res.json(200,r1);
      });
    }else{
      res.json(e,{},r);
    }
  });
};

User._filter = function (uid,token,cb) {
  redis.getObj('session:'+uid,function(e,r){
    if(!e){
      if(r.accessToken === token){
        cb(null,null);
      }else{
        cb(403,'登录过期')
      }
    }else{
      cb(501,e);
    }
  });
}

module.exports = User;