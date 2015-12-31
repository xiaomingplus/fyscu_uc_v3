/**
 * Created by lanhao on 15/5/17.
 */
'use strict';

let userModel = require('../models/user');
let appModel = require('../models/app');
let redis = global.app.libs.redis;

let User = {};

module.exports = User;