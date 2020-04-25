var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var cors=require('cors'); //后端跨域解决办法
var bodyParser = require('body-parser');/*post方法*/


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var codeRouter = require('./routes/sendEmail');
var stationRouter = require('./routes/station');
var lineRouter = require('./routes/line');
var newsRouter = require('./routes/news');
var messageRouter=require('./routes/message');
var workRouter=require('./routes/work');
var changeRouter=require('./routes/changeLine')

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//实现跨域
app.all('*', function (req, res, next) {
  //设置请求头为允许跨域
  res.header("Access-Control-Allow-Origin", '*');
  //设置服务器支持的所有头信息字段
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  //设置服务器支持的所有跨域请求的方法
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Credentials", "true");
  next();//表示进入下一个路由
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit:'50mb'}));// 添加json解析
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}));

//路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/code',codeRouter);
app.use('/station',stationRouter);
app.use('/line',lineRouter);
app.use('/news',newsRouter);
app.use('/message',messageRouter);
app.use('/work',workRouter);
app.use('/change',changeRouter)

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
