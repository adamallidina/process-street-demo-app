var express = require('express'),
    http    = require('http'),
    path    = require('path'),

// config

    HTTP_PORT        = 3000,
    SERVING_DIR_NAME = 'frontend';

var simpleServer = express();

simpleServer.set('port', process.env.PORT || 3000);

simpleServer.use(express.static(path.join(__dirname, SERVING_DIR_NAME)));

http.createServer(simpleServer).listen(simpleServer.get('port'), function () {
  console.log('Simple server listening on: ' + simpleServer.get('port'));
});
