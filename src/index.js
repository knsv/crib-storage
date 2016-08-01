/**
 * Created by knut on 2016-04-17.
 */
var cronJob = require('cron').CronJob;
var cribMq = require('crib-mq');
var storage = require('node-persist');

storage.init({
    dir:'../../../../db',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,  // can also be custom logging function
    continuous: true,
    interval: false,
    ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
});

var buss = cribMq.register('crib-storage', 'http://127.0.0.1:8900');
console.log('Starting Storage service', process.cwd());
var db = {};


    module.exports = function (config) {

        console.log('Setting up event handlers');
        buss.on('SET',function(data){
            storage.setItem(data.key, data.value);
        });

        buss.on('GET',function(data){

            console.log('Fetching data for ',data.key);
            storage.getItem(data.key, (res) => {
               console.log('Result = ',res)
            });

            buss.emit('DATA',{
                value: storage.getItem(data.key),
                requestId: data.requestId
                }
            );
        });
    };

var conf = require(process.cwd() + '/crib.conf.js');
module.exports(conf);