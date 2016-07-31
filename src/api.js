// We need this to build our post string
var Q = require('q');

let buss = undefined;

exports.init = (_buss) => {
    buss = _buss;
};

const idDb = {};

// Get playlists.
exports.get = function get(key) {
    var deferred = Q.defer();

    const requestId = Math.random().toString(36).substring(7);

    // Store the promise for this partcular request
    idDb[requestId] = deferred;

    // Send the request
    buss.emit('GET', {requestId, key});

    buss.on('DATA',(data) => {
        const requestDeferred = idDb[data.requestId];
        if(requestDeferred){
            requestDeferred.resolve(data);
        }
    });

    return deferred.promise;
};

exports.set = function(key, value){
    buss.emit('SET', {key, value});
};
