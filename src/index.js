/**
 * Created by knut on 2016-04-17.
 */
var cronJob = require('cron').CronJob;
var cribMq = require('../../crib-mq');
var storage = require('node-persist');
var cribLog = require('../../crib-log/src/api');
var log = cribLog.createLogger('crib-storage','debug');

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

log.info('Starting Storage service using this buuss: ', process.env.CRIB_BUSS_URL);
var buss = cribMq.register('crib-storage');
log.debug('Starting Storage service at this path: ', process.cwd());
var db = {};


buss.on('SET',function(data){
    log.info('Setting data in perstent storage, key: ',data.key);
    //log.info('Setting data in perstent storage, data: ',data.value);
    storage.setItem(data.key, data.value);
});

buss.on('GET',function(data){

    console.log('Fetching data for ',data.key);
    // storage.getItem(data.key, (res) => {
    //     log.debug('Result from data fetch for ',data.key,' is resulted in:',res);
    // });

    buss.emit('DATA',{
            value: storage.getItem(data.key),
            requestId: data.requestId
        }
    );
});

console.log('Storage service STARTED', process.cwd());