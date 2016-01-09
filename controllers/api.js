/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
let async = require('async');
let userModel = require('../models/user');
let appModel = require('../models/app');
let redis = global.app.libs.redis;

let Api = {};

Api.index = function(req,res){
    let method = req.method.toLowerCase();
    if(Api[method]){
        Api[method](req,res);
    }else{
        res.json(404,'method not found');
    }
}

Api.get = function(req,res){
    let appId = req.headers.appid;
    let appKey = req.headers.appkey;
    let account = req.headers.account;
    let token = req.headers.token;
    let dPath = req.body.path?req.body.path:'';
    async.waterfall([
        function(callback){
            // filter
            Api._filter(account,token, function (e, r) {
                if(!e){
                    if(r && (r.token == token)){
                        callback(null,null);
                    }else{
                        callback(402,'授权过期');
                    }
                }else{
                    callback(500,JSON.stringify(e));
                }
            });
        },
        function(flow,callback){
            //data
            if(appModel.checkPermission(appId,appKey,dPath)){
                userModel.branch(account,dPath, function (e, r) {
                    if(!e){
                        callback(null,r);
                    }else{
                        callback(500,'databases error(1)');
                    }
                });
            }else{
                callback(403,'权限不足');
            }
        },
        function (flow, callback) {
            // log
            callback(null,flow);
        }
    ], function (err, ret) {
        if(err){
            res.json(err,{},ret);
        }else{
            res.json(200,ret);
        }
    });
}

Api.post = function(req,res){
    let appId = req.headers.appid;
    let appKey = req.headers.appkey;
    let account = req.headers.account;
    let token = req.headers.token;
    let dPath = req.body.path;
    let dData = req.body.data;
    async.waterfall([
        function(callback){
            // filter
            Api._filter(account,token, function (e, r) {
                if(!e){
                    if(r && (r.token == token)){
                        callback(null,null);
                    }else{
                        callback(402,'授权过期');
                    }
                }else{
                    callback(500,JSON.stringify(e));
                }
            });
        },
        function(flow,callback){
            //data
            if(appModel.checkPermission(appId,appKey,dPath)){
                userModel.append(account,dPath,dData, function (e, r) {
                    if(!e){
                        callback(null,r);
                    }else{
                        callback(500,'databases error(1)');
                    }
                });
            }else{
                callback(403,'权限不足');
            }
        },
        function (flow, callback) {
            // log
            callback(null,flow);
        }
    ], function (err, ret) {
        if(err){
            res.json(err,{},ret);
        }else{
            res.json(200,ret);
        }
    });
}


Api.put = function(req,res){
    let appId = req.headers.appid;
    let appKey = req.headers.appkey;
    let account = req.headers.account;
    let token = req.headers.token;
    let dPath = req.body.path;
    let dData = req.body.data;
    async.waterfall([
        function(callback){
            // filter
            Api._filter(account,token, function (e, r) {
                if(!e){
                    if(r && (r.token == token)){
                        callback(null,null);
                    }else{
                        callback(402,'授权过期');
                    }
                }else{
                    callback(500,JSON.stringify(e));
                }
            });
        },
        function(flow,callback){
            //data
            if(appModel.checkPermission(appId,appKey,dPath)){
                userModel.edit(account,dPath,dData, function (e, r) {
                    if(!e){
                        callback(null,r);
                    }else{
                        callback(e,'databases error(1):'+r);
                    }
                });
            }else{
                callback(403,'权限不足');
            }
        },
        function (flow, callback) {
            // log
            callback(null,flow);
        }
    ], function (err, ret) {
        if(err){
            res.json(err,{},ret);
        }else{
            res.json(200,ret);
        }
    });
}

Api._filter = function (account, token, cb) {
    redis.getObj('session:'+account, function (e, r) {
        cb(e,r);
    });
}


module.exports = Api;