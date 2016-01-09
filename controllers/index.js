/**
 * Created by lanhao on 15/5/17.
 */

'use strict';


var Controller = {};

Controller.index = function (req, res) {
    var appId = req.query.appId || req.query.appid || 0;
    var redirectUrl = req.query.callback;
    res.render('index.html', {
        'license':global.app.config.license,
        'name': 'xiaobq',
        'appId': appId,
        'callback':redirectUrl
    });
};

Controller.error = function (req, res) {
    res.render('error.html',{'msg':'ceshi '});
}

Controller.debug = function(req,res){
    console.log(req.headers);
    res.json(200,req.body,'debug ok');
}

module.exports = Controller;