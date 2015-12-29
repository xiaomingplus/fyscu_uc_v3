

var redis = require('redis');

var REDIS = {};

REDIS.master = redis.createClient(6379, '121.41.85.236', {});
//REDIS.master = redis.createClient(6379, '10.168.29.182', {});

REDIS.slave = redis.createClient(6379, '121.41.85.236', {});
//REDIS.slave = redis.createClient(6380, '10.171.202.66', {});


REDIS.has = function (key,cb) {
    REDIS.slave.send_command('EXISTS',[key], function (e, r) {
        cb(e,r);
    });
};

REDIS.saveObj = function(key,obj,cb){
    REDIS.master.HMSET(key,obj,cb);
};

REDIS.increase = function(args,cb){
    REDIS.master.send_command('HINCRBY',args,function(err,rep){
        //args  [key fiels 1]
        cb(err,rep);
    });

};


REDIS.saveExpireObj = function(key,obj,expire,cb){
    REDIS.master.HMSET(key,obj,function(e){
        if(e){
            cb(e);
            return;
        }
        REDIS.master.EXPIRE(key,expire,function(ee,rr){
            cb(ee,rr);
        });
    })
};

REDIS.incrby = function (args,cb) {
    REDIS.master.send_command('INCRBY',args,function(err,rep){
        //args  [key  1]
        cb(err,rep);
    });
};

REDIS.getObj = function(key,cb){
    REDIS.slave.hgetall(key,function(e,r){
        cb(e,r);
    });
};

REDIS.getValue = function(key,cb){
    REDIS.slave.get(key,function(e,r){
        cb(e,r);
    });
};

REDIS.saveValue = function(key,value,cb){
    REDIS.master.set(key,value,function(e,r){
        cb(e,r);
    });
};

REDIS.addSet = function(key,member,score,cb){
    REDIS.master.send_command('ZADD',[key,score,member],function(e,r){
        cb(e,r);
    });
};

REDIS.getSet = function(key,cb){
    REDIS.slave.send_command('ZRANGE',[key,0,-1],function(e,r){
        cb(e,r);
    });
};

REDIS.setCache = function(key,value,seconds,cb){
    REDIS.master.send_command('SETEX',[key,seconds,value],function(e,r){
        cb(e,r);
    });
};

REDIS.push = function(key,value,cb){
    REDIS.master.send_command('RPUSH',[key,value],function(e,r){
        cb(e,r);
    });
};

REDIS.pop = function(key,cb){
    REDIS.master.send_command('LPOP',[key],function(e,r){
        cb(e,r);
    });
};

module.exports = REDIS;



REDIS.master.on("error", function (err) {
    if(err){
        console.log("Error " + err);
    }

});

REDIS.master.on("connect",function(err){
    if(err){
        console.log('connect open:'+err);
    }

});

REDIS.slave.on("error", function (err) {
    if(err){
        console.log("Error " + err);
    }

});

REDIS.slave.on("connect",function(err){
    if(err){
        console.log('connect open:'+err);
    }

});
