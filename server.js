/**
 * Created by lanhao on 15/5/17.
 */
'use strict';

require('pmx').init({
    http : true
});

//引入配置文件
var config = require('./config/config');

//引入小蓝框架
var xiaolan = require('xiaolan')(config);

//启动监听服务
xiaolan.createServer();

require('./models/app').init();
