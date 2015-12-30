'use strict';
var async = require('async');
var md5 =  require('../libs/aes128').md5;
var http = require('../libs/httpAgent');
var esHost = 'http://121.41.85.236:9200';
//var esHost = 'http://127.0.0.1:9200';


let user = {};

user.add = function (userIdentify,data,cb) {
    if(userIdentify && data){
        async.waterfall([
            function (callback) {
                http.head(esHost+'/uc/users/'+userIdentify, function (e, r) {
                    if(r == 200){
                        //user has already exists
                        callback(400,'用户已经存在');
                    }else if(r == 404 ){
                        //create a user
                        callback(null,null);
                    }else{
                        callback(500,'内部错误');
                    }
                });
            },
            function (flow,callback) {
                http.put(esHost+'/uc/users/'+userIdentify,data, function (e, r) {
                    if(!e){
                        callback(null,r?r.body:null);
                    }else{
                        callback(e,r);
                    }
                });
            }
        ], function (err, ret) {
            if(!err){
                cb(null,data);
            }else{
                cb(err,ret);
            }
        });
    }else{
        cb(400,'参数有误');
    }
};

user.get = function (userIdentity, cb) {
    http.get(esHost+'/uc/users/'+userIdentity,{}, function (e, r) {
        if(e){
            console.log((r&&r.body)?r.body:r);
            cb(e,null);
        }else{
            let body = r?r.body:null;
            if(body){
                if(body.found){
                    cb(null,body._source);
                }else{
                    cb(404,'user not found');
                }
            }else{
                console.log(r);
                cb(500,'body parsing error');
            }
        }
    });
}


user.del = function (userIdentity,cb) {
    http.del(esHost+'/uc/users/'+userIdentity, function (e, r) {
        cb(e,r?r.body:null);
    });
}

user.auth = function(account,password,cb){
    if(account && password){
        user.match('/accounts/fyuc/u',account, function (e, r) {
            if(!e){
                if(r.count > 0){
                    let fyuc = (r.result && r.result.length)?r.result[0]._source.accounts.fyuc[0]:{};
                    if(fyuc.p == md5(''+account+password)){
                        cb(null,r.result[0]);
                    }else{
                        cb(402,'授权失败');
                    }
                }else{
                    cb(404,'account not found');
                }
            }else{
                cb(e,r);
            }
        });
    }else{
        cb(403,'授权失败');
    }
};



user.match = function (dPath, value, cb) {
    if(typeof value == 'object'){
        value = JSON.stringify(value);
    }
    let term = {};
    term[dPath.split('/').join('.').substr(1)] = value;

    http.get(esHost+'/uc/users/_search',{
        "version":true,
        "query":{
            "term":term
        }
    }, function (e, r) {
        if(!e){
            cb(null,{
                'count':r.body.hits.total,
                'result':r.body.hits.hits
            });
        }else{
            cb(500,'storage error');
        }
    });
}

module.exports = user;