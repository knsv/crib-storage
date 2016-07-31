/**
 * Created by knut on 2016-04-17.
 */
var cronJob = require('cron').CronJob;
var cribMq = require('crib-mq');

var buss = cribMq.register('crib-storage', 'http://127.0.0.1:8900');
console.log('Starting Storage service', process.cwd());
var db = {};


    module.exports = function (config) {

        buss.on('SET',function(data){
            console.log('Setting data');
            db[data.key] = data.value;
        });

        buss.on('GET',function(data){
            console.log('Setting data');
            buss.emit('DATA:'+data.requestId,db[data.key]);
        });
    };

var conf = require(process.cwd() + '/crib.conf.js');
module.exports(conf);