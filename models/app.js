'use strict';
var http = require('../libs/httpAgent');
var redis = require('../libs/redis');
var aes128 = require('../libs/aes128');

var esHost = 'http://121.41.85.236:9200';
//var esHost = 'http://127.0.0.1:9200';

let app = {};

app.model = function () {
    this.appName = '';
    this.appId = undefined;
    this.appKey = undefined;
    this.status = 1;
    this.domain = '';
    this.permission = [];
};

app.all = {};

http.get(esHost+'/uc/apps/_search',{}, function (e, r) {
    if(r && r.body){
        try{
            let arr = r.body.hits.hits;
            for(let k in arr){
                app.all[arr[k]['_id']] = arr[k]['_source'];
            }
        }catch(ex){
            console.log(ex);
        }
    }
});

app.create = function(name,domain,cb){
    redis.incrby(['ai:appId',1], function (e, r) {
       if(!e){
           let appId = r;
           let m = new app.model();
           m.appName = name;
           m.appId = appId;
           m.appKey = aes128.md5('uc_app'+appId+name+domain);
           m.domain = domain;
           m.permission.push('getUserInfo');
           http.put(esHost+'/uc/apps/'+appId,m, function (e1, r1) {
               if(!e1){
                   cb(null,r1?r1.body:null);
               }else{
                   cb(e1,r1);
               }
           });
       } else{
           cb(e,r);
       }
    });
};

app.delete = function (appId, cb) {
    http.del(esHost+'/uc/apps/'+appId, function (e, r) {
       cb(e,r?r.body:null);
    });
};

app.permission = function (appId, permissions, cb) {
    if(appId && (typeof permissions=='object' && permissions.length>0)){
        http.get(esHost+'/uc/apps/'+appId,{}, function (e, r) {
            if(!e){
                let body = r?r.body:null;
                if(body){
                    if(body.found){
                        body._source.permission = permissions;
                        http.put(esHost+'/uc/apps/'+appId,body._source, function (e1, r1) {
                            cb(e1,body._source);
                        });
                    }else{
                        cb(404,'target not found');
                    }
                }else{
                    cb(501,'http body parsing error');
                }
            }else{
                cb(501,'http error');
            }
        });
    }else{
        cb(400,'参数有误');
    }
};



module.exports = app;