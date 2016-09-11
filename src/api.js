// We need this to build our post string
let Q = require('q');
let buss = undefined;
var cribLog = require('../../crib-log/src/api');
var log = cribLog.createLogger('crib-storage','debug');

const idDb = {};

exports.init = (_buss) => {
    buss = _buss;


    buss.on('DATA',(data) => {
        const requestDeferred = idDb[data.requestId];
        log.info('Waiting promise for data: ',requestDeferred);
        if(requestDeferred){
            log.info('Data found for ',data.requestId);
            requestDeferred.resolve(data.value);
        }
    });
};

// Get playlists.
exports.get = function get(key) {
    var deferred = Q.defer();
    const requestId = Math.random().toString(36).substring(7);
    log.info('Fetching data for ',key,' with request id ',requestId);

    // Store the promise for this partcular request
    idDb[requestId] = deferred;

    // Send the request
    buss.emit('GET', {requestId, key});

    return deferred.promise;
};

exports.getPromiseForKey = (key) => idDb[key];


exports.set = function(key, value){
    const requestId = Math.random().toString(36).substring(7);

    buss.emit('SET', {key, value});
};
