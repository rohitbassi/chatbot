var app = require('express')();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var apiai = require('apiai');
var requestify = require('requestify');
var cors = require('cors');
var config = require('./config.js');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var swaggerJSDoc = require('swagger-jsdoc');
var expressValidator = require('express-validator');
var first = require('./first');
var log4js = require('log4js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('secret', '37LvDSm4XvjYOh9Y');
var routermessage = require ('./first.js');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/first',routermessage);
app.use(cors());
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
module.exports = app;

http.listen(5000, function(){
});
