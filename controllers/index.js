/**
 * Created by lanhao on 15/5/17.
 */

'use strict';


var Index = {};

Index.index = function (req, res) {
    var appId = req.query.appId || req.query.appid || 0;
    var redirectUrl = req.query.callback;
    res.render('index.html', {
        'license':global.app.config.license,
        'name': 'xiaobq',
        'appId': appId,
        'callback':redirectUrl
    });
};

Index.error = function (req, res) {
    res.render('error.html',{'msg':'ceshi '});
}

Index.debug = function(req,res){

    res.json(200,{
        'query':req.query,
        'body':req.body,
        'method':req.method,
        'headers':req.headers
    },'debug ok');
}

Index.resetPassword = function(req,res){
    var appId = req.query.appId || req.query.appid || 0;
    var redirectUrl = req.query.callback;

    res.render('findPw.html',{
        'license':global.app.config.license,
        'name': 'xiaobq',
        'appId': appId,
        'callback':redirectUrl
    });
}

module.exports = Index;