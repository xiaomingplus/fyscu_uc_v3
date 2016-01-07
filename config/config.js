/**
 * Created by lanhao on 15/5/17.
 */
module.exports = {
  'version': '1.0.0',
  'license':' © 2015 FYSCU , Fcoder 2.2 XJBG license.',
  'port': 9528,
  'ip': null,
  'cors': false,
  'static': ['js', 'css', 'jpg', 'png', 'ico'],
  'modules': {
    'mysql': {
      'import': 0,
      'config': {
        "host": "127.0.0.1",
        "port": "3306",
        "user": "root",
        "password": "",
        "database": "platform_ng"
      }
    },
    'session': {
      'import': 1,
      'config': {
        'age': 60
      }
    },
    'tools':{
      'import':1,
      'config':{}
    },
    'redis':{
      'import':1,
      'config':{
        'host':'127.0.0.1',
        'port':6379
      }
    }
  },
  'params':{
      'SP_LOGIN_SIGN_TIME_LIMIT':1000 * 3600
  }
};