'use strict';
/**
 * Created by lanhao on 16/2/10.
 */
//var httpAgent = require('./libs/httpAgent');
//var mysql = require('easymysql');
//var db = mysql.create({
//    'maxconnections':10
//});

//db.addserver({
//    'host':'203.195.164.179',
//    'user':'lanhao',
//    'password':'xiaomilanto213',
//    'database':'fyscu_platform'
//});
//
//console.log('init system');

//console.log('init apps');
//db.query('select * from app_info', function (e, r) {
//    if(r.length){
//        for(let k in r){
//            httpAgent.put('http://127.0.0.1:9200/uc/apps/'+r[k].id,{
//                appName:r[k].appname,
//                appId:r[k].id,
//                appKey:r[k].appkey,
//                status:1,
//                domain:'fyscu.com',
//                role:'app',
//                permission:[
//                    'getUserInfo'
//                ],
//                creatAt:r[k].dateline
//            }, function (e, r) {
//                console.log('done');
//            });
//        }
//    }
//});

//console.log('init users');
//db.query('select * from uc_account', function (e, r) {
//    if(r.length){
//        var count = 0;
//        for(let k in r){
//            if(r[k].tel!=''){
//                //console.log(r[k]);break;
//                httpAgent.put('http://127.0.0.1:9200/uc/users/'+r[k].tel,{
//                    contact:{
//                        tel:[
//                            {
//                                "value": r[k].tel,
//                                "note": r[k].username
//                            }
//                        ]
//                    },
//                    '_account':{
//                        'fyuc':[
//                            {
//                                'u':r[k].tel,
//                                'p':r[k].password
//                            }
//                        ]
//                    },
//                    'preference':{
//                        'apps':[]
//                    }
//                }, function (e, r) {
//                    console.log(count++);
//                });
//            }
//        }
//    }
//});

