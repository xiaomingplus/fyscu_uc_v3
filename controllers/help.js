/**
 * Created by lanhao on 15/5/17.
 */

"use strict";
let userModel = require('../models/user');

var Controller = {};

Controller.index = function (req, res) {
    res.html('help.html');
};

Controller.demo = function (req, res) {
    if(req.query.account && req.query.token ){
        req.session.user = req.query;
    }
    res.html('demo.html');
}

Controller.poxy = function(req,res){
    let t= req.query.t;
    userModel.branch(req.session.user.account,'/'+t,function(e,r){
        res.json(200,r);
    });
}

module.exports = Controller;