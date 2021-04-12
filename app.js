const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// var cookieParser = require('cookie-parser')
// var logger = require('morgan')
const createError = require('http-errors')
const express = require('express');
const app = express();

const sysRoute= require('./routes/mysql/sys');
const uploadRoute= require('./routes/mysql/upload');
const oscarRoute= require('./routes/mysql/oscar');
const mongoRoute= require('./routes/mongodb/index');


// Set public folder (static resource such image mp4)
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.static(path.join(__dirname, 'public')))

// Body parser middleware 解析json类型的body 路由回调中，通过req.body.password来获取
app.use(bodyParser.json({limit: '50mb'}))
// 获取解析application/x-www-form-urlencoded类型的body
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors());
// app.use(cookieParser())
// app.use(logger('dev'))

app.use('/sys/upload',uploadRoute);
app.use('/tb',oscarRoute);
app.use('/',sysRoute);
app.use('/mongo',mongoRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
})
// error handler need ejs engine
/*app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500);
    res.render('error');
})*/

//端口同springboot一致
const port = 8080
app.listen(port, () => console.log(`** Express started on port ${port}`))
