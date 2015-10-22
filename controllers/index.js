/**
 * Created by lanhao on 15/5/17.
 */



var Controller = {};

Controller.index = function (req, res) {
  res.render('index.html', {
    'name': 'xiaobq',
    'appId':req.query.appId
  });
};

module.exports = Controller;