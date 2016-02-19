'use strict';
var request = require('request');

var httpAgent = {};

httpAgent.version = '1';

httpAgent.headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/json'
};

httpAgent.head = function (path, cb) {
    var options = {
        url: path,
        method: 'head',
        headers: httpAgent.headers
    };
    request(options, function (e, r) {
        cb(e, r ? r.statusCode : 404);
    });
};

httpAgent.brew = function (path, data, cb) {
    httpAgent.headers['Content-Type'] = 'application/coffee-pot-command';
    let options = {
        url:path,
        method:'brew',
        headers:httpAgent.headers,
        data:data
    };
    request(options, function (e, r) {
        cb(e,r);
    });
};

httpAgent.post = function (path, data, cb) {
    var options = {
        url: path,
        method: 'post',
        headers: httpAgent.headers,
        json: data
    };

    request(options, function (e, r) {
        cb(e, r);
    });
};

httpAgent.put = function (path, data, cb) {
    var options = {
        url: path,
        method: 'put',
        headers: httpAgent.headers,
        json: data
    };
    request(options, function (e, r) {
        cb(e, r);
    });
};

httpAgent.patch = function (path, data, cb) {
    var options = {
        url: path,
        method: 'patch',
        headers: httpAgent.headers,
        json: data
    };
    request(options, function (e, r) {
        cb(e, r);
    });
};


httpAgent.get = function (path, data, cb) {
    //path += '?';
    //for(var k in data){
    //  path += k+'='+data[k]+'&';
    //}
    var options = {
        url: path,
        method: 'get',
        headers: httpAgent.headers,
        json: data
    };
    request(options, function (e, r) {
        cb(e, r);
    });
};

httpAgent.del = function (path, cb) {
    var options = {
        url: path,
        method: 'delete',
        headers: httpAgent.headers
    };
    request(options, function (e, r) {
        cb(e, r);
    });
};

module.exports = httpAgent;

/**
 * Change Log
 * 1     init
 */
