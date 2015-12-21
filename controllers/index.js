/**
 * Created by lanhao on 15/5/17.
 */



var Controller = {};

Controller.index = function (req, res) {
    var appId = req.query.appId || req.query.appid || 0;
    res.render('index.html', {
        'license':global.app.config.license,
        'name': 'xiaobq',
        'appId': appId
    });
};

Controller.error = function (req, res) {
    res.render('error.html',{'msg':'ceshi '});
}
module.exports = Controller;