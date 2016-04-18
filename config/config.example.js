/**
 * Created by lanhao on 15/5/17.
 */
module.exports = {
  'version': '3.0.0',
  'license':' © 2016 FYSCU , Fcoder 2.2 XJBG license.',
  'port': 3001,// your customer port
  'ip': null,
  'cors': false,
  'static': ['js', 'css', 'jpg', 'png', 'ico'],//static file list,
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
      'ES_HOST':'http://127.0.0.1:9200',
      'smskey':'__YOUR__SMS__KEY__'
  }
};