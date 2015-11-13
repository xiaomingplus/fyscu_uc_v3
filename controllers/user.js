/**
 * Created by lanhao on 15/5/17.
 */
'use strict';

let nodedb = require('../node_modules/nodedb')({
    'path': './db'
});
let appInfo = global.appinfo;
let redis = global.app.libs.redis;

let User = {};

User.setter = function (req, res) {
    let appId = req.body.appId;
    let appKey = req.body.appKey;
    if (appInfo[appId] && (appInfo[appId].appkey == appKey)) {
        let uid = req.body.uid;
        let accessToken = req.body.accessToken;
        let path = req.body.path;
        let data = req.body.data;
        let index = req.body.index;
        User._filter(uid, accessToken, function (e, r) {
            if (!e) {
                if (path[0] !== '/') {
                    path = '/' + path;
                }
                nodedb.put('/' + uid + path, data, index, function (e1, r1) {
                    if(e1){
                        res.json(501,e1,'');
                    }else{
                        res.json(200,{},'');
                    }
                });
            } else {
                res.json(e, {}, r);
            }
        });
    } else {
        res.json(403, {}, '权限不足');
    }
}

User.info = function (req, res) {
    let appId = req.query.appId;
    let appKey = req.query.appKey;
    if (appInfo[appId] && (appInfo[appId].appkey == appKey)) {
        let uid = req.query.uid;
        let accessToken = req.query.accessToken;
        User._filter(uid, accessToken, function (e, r) {
            if (!e) {
                nodedb.get('/' + uid + (req.params[2] || ''), function (e1, r1) {
                    res.json(200, r1);
                });
            } else {
                res.json(e, {}, r);
            }
        });
    } else {
        res.json(403, {}, '权限不足');
    }
};

User._filter = function (uid, token, cb) {
    redis.getObj('session:' + uid, function (e, r) {
        if (!e) {
            if (r.accessToken === token) {
                cb(null, null);
            } else {
                cb(403, '登录过期')
            }
        } else {
            cb(501, e);
        }
    });
}

module.exports = User;