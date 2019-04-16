var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Routes     = require('./server/routes');
var app = express(); 
var http = require('http').Server(app);

var port = process.env.PORT || 1990;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({
    type: 'application/octetstream',
    limit: '10mb'
}));
app.use(cookieParser());

app.use('/', Routes);
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', function(req, res) {	
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

http.listen(port, function(){
	console.log('listening on *:1990');
});

module.exports = http;
