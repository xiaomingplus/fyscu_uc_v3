/**
 * Created by lanhao on 15/10/17.
 */
var request = require('request');
var md5 = require('./node_modules/xiaolan/lib/tools')({}).md5;
var nodedb = require('nodedb')({
    'path': './db'
});
function http_post(url, data) {
    request.post({
        'url': url,
        'json': data
    }, function (e, r) {
        console.log(e, r.body);
    });
};
//http get
function http_get(url, data) {
    if (data) {
        url += '?';
        for (var k in data) {
            url += k + '=' + data[k] + '&';
        }
    }
    //console.log(url);

    request.get(url, function (e, r) {
        console.log(e, r ? r.body : null);
    });

};

