var mongoose = require('mongoose');


//var dbaddress = 'hanstyle:whoami@12345@127.0.0.1';
var dbaddress = '121.41.83.170';//'127.0.0.1';
var dbName = 'hanstyle';

console.error('[mongodb] db address:%s',dbaddress);
var dbAdress = 'mongodb://'+dbaddress+'/'+dbName;

//mongoose.connect('mongodb://y87iut03d4:le44ldve04@mongo.labs.taobao.net:27017/n6wejl87xkquwnx7k9s0');
mongoose.connect(dbAdress);
var db = mongoose.connection;
db.on('error', function(err){
    console.error('[mongodb] connect to %s error: ',  err.message);
    process.exit(1);
});
db.once('open', function () {
   console.info('[mongodb] once open');
});

require('./mongoScheme');

exports = db;