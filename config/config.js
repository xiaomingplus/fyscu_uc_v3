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
      'import': 1,
      'config': {
        "host": "121.41.85.236",
        "port": "3306",
        "user": "ciwei",
        "password": "123456",
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
        'host':'121.41.85.236',
        'port':6379
      }
    }
  }
};