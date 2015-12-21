/**
 * Created by lanhao on 15/5/17.
 */



var Controller = {};

Controller.index = function (req, res) {

    res.html('help.html');
};

Controller.demo = function (req, res) {
    res.html('demo.html');
}
module.exports = Controller;