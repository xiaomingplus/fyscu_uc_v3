'use strict';
var async = require('async');
var md5 =  require('../libs/aes128').md5;
var http = require('../libs/httpAgent');

var esHost = require('../config/config').params.ES_HOST;


let user = {};

user.model = {
    '_account':{
        'fyuc':[
            {
                u:'string',
                p:'md5_hash'
            }// ...
        ]//...
    },
    'contact':{
        'tel':[
            {
                'value':'110',
                'note':'police'
            }//...
        ],
        'email':[
            {
                'value':'admin@lanhao.name',
                'note':'xiaolan'
            }//...
        ]
    },
    'preference':{
        'app':[
            '1000'
            //...
        ],
        'color':[
            'red'
        ]
        //...
    },
    '_cookie':{

    }
};


/**
 * 增加一个文档
 */
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

/**
 * 覆盖整个文档
 */
user.set = function (userIdentity,data,cb) {
    if(userIdentity && data){
        async.waterfall([
            function (callback) {
                http.put(esHost+'/uc/users/'+userIdentity,data, function (e, r) {
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

/**
 * 获取整个文档
 */
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

/**
 * 删除这个文档
 */
user.del = function (userIdentity,cb) {
    http.del(esHost+'/uc/users/'+userIdentity, function (e, r) {
        cb(e,r?r.body:null);
    });
}

/**
 * 验证 _account 数据，登录专用
 */
user.auth = function(account,password,cb){
    if(account && password){
        user.match('/_account/fyuc/u',account, function (e, r) {
            if(!e){
                if(r.count > 0){
                    let fyuc = (r.result && r.result.length)?r.result[0]._source._account.fyuc[0]:{};
                    console.log(fyuc.p , md5(''+account+password));
                    if(fyuc.p == md5(''+account+password)){
                        cb(null,r.result[0]);
                    }else{
                        cb(402,'授权失败,密码错误');
                    }
                }else{
                    cb(404,'帐号不存在');
                }
            }else{
                cb(e,r);
            }
        });
    }else{
        cb(403,'授权失败，缺少参数');
    }
};

/**
 * 全匹配查找
 */
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

/**
 * 从指定路径里读取数据
 */
user.branch = function (userIdentity, dPath, cb) {
    user.get(userIdentity, function (e, r) {
        if(!e){
            //cb(null,r);
            let result = r;
            let dArr = dPath.split('/');
            while(dArr.length>1){
                dArr.shift();
                if(dArr[0]!='') {
                    result = result[dArr[0]];
                }
            }
            cb(null ,result?result:null);
        }else{
            cb(e,r);
        }
    });
};

/**
 * 从现有数组里剔除数据
 */
user.delBranch = function (userIdentity, dPath, cb) {
    user.get(userIdentity, function (e, r) {
        if(!e){
            //cb(null,r);
            let result = r;
            let _parentNode = r;
            let dArr = dPath.split('/');
            while(dArr.length>1){
                dArr.shift();
                if(dArr[0]!='') {
                    _parentNode = result;
                    result = result[dArr[0]];
                }
            }
            if(result){
                if(Array.isArray(_parentNode)) {
                    _parentNode.splice(dArr[0], 1);
                    user.set(userIdentity, r, function (e1, r1) {
                        if (!e1) {
                            cb(null, r);
                        } else {
                            cb(e1, r1);
                        }
                    });
                }else{
                    cb(400,'数据结构不允许 '+dPath);
                }
            }else{
                cb(404,'not found');
            }
        }else{
            cb(e,r);
        }
    });
}

/**
 * 修改现有数据的值
 */
user.edit = function(userIdentity,dPath,dData,cb){
    user.get(userIdentity, function (e, r) {
        if(!e){
            let dArr = dPath.split('/');
            let _tempNode = r;
            let _parentNode = null;
            let _parentKey = null;
            let sig = true;
            let errorMsg = '';
            while(dArr.length > 1){
                dArr.shift();
                if(dArr[0] != ''){
                    _parentNode = _tempNode;
                    _parentKey = dArr[0];
                    _tempNode = _tempNode[dArr[0]];
                    if(_tempNode == undefined){
                        errorMsg += '不存在这个数据';
                        sig = false;
                        break;
                    }
                }
            }
            if(Array.isArray(_tempNode)){
                //数组类型不能set
                errorMsg += '数组类型不能set';
                sig = false;
            }

            if(sig && (typeof _tempNode == typeof dData)){
                if(typeof dData == 'object'){
                    for(let k in dData){
                        _parentNode[_parentKey][k] = dData[k];
                    }
                }else {
                    _parentNode[_parentKey] = dData;
                }
                user.set(userIdentity,r, function (e1, r1) {
                    if(!e1){
                        cb(null,r);
                    }else{
                        cb(e1,r1);
                    }
                });
            }else{
                cb(400,'数据结构不允许,'+errorMsg);
            }
        }else{
            cb(e,r);
        }
    });
}

/**
 * 向现有数组里push数据
 */
user.append = function (userIdentity, dPath, dData, cb) {
    user.get(userIdentity, function (e, r) {
        if(!e){
            let dArr = dPath.split('/');
            let _modelNode = user.model;
            let _tempNode = r;
            let _parentNode = null;
            let _parentKey = null;
            let sig = true;
            let errorMsg = '';
            while(dArr.length > 1){
                dArr.shift();
                if(dArr[0] != ''){
                    _modelNode = _modelNode[dArr[0]];
                    _parentNode = _tempNode;
                    _parentKey = dArr[0];
                    _tempNode = _tempNode[dArr[0]];
                    if(_modelNode == undefined){
                        errorMsg += '不存在这个数据';
                        sig = false;
                        break;
                    }
                }
            }

            if(sig &&Array.isArray(_modelNode) && (typeof _modelNode[0] == typeof dData)){
                if(_parentNode[_parentKey]==undefined){
                    _parentNode[_parentKey] = [];
                }
                _parentNode[_parentKey].push(dData);

                user.set(userIdentity,r, function (e1, r1) {
                    if(!e1){
                        cb(null,r);
                    }else{
                        cb(e1,r1);
                    }
                });
            }else{
                cb(400,'数据结构不允许,'+errorMsg);
            }
        }else{
            cb(e,r);
        }
    });
}


user.setCookie = function (userIdentity,appId,hash, data, cb) {
    async.waterfall([
        function (callback) {
            user.get(userIdentity, function (e, r) {
                if(!e){
                    callback(null,r);
                }else if(e==404){
                    http.put(esHost+'/uc/users/'+userIdentity,{}, function (e1, r1) {
                        callback(e1,{});
                    });
                }else{
                    callback(e,r);
                }
            });
        },
        function (flow,callback) {
            let _user = flow;
            if(!_user._cookie){
                _user._cookie = {};
            }
            if(!_user._cookie[appId]){
                _user._cookie[appId] = {};
            }
            _user._cookie[appId][hash] = data;
            user.set(userIdentity,_user, function (e, r) {
                callback(e,r);
            });
        }
    ], function (err, ret) {
        if(!err){
            cb(null,ret);
        }else{
            cb(err,ret);
        }
    });
}

module.exports = user;

//user.del(18688124774, function (e, r) {
//    console.log(e,r);
//});

//user.setCookie(18688124774,1000,'fav',['acm','roma'], function (e, r) {
//    console.log(e,r);
//});


//user.auth('18688124774','lanhao2603891', function (e, r) {
//    console.log(e,r);
//});
