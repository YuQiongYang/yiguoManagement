const path = require('path');
const express = require('express'); //第三方模块
let app = express();

const bp = require('body-parser'); //第三方模块
const cp = require('cookie-parser'); //第三方模块
const session = require('express-session'); //第三方模块

//全局使用--use
app.use(cp());

app.use(session({
  secret: '12345', //用来对session数据进行加密的字符串.这个属性值为必须指定的属性
  name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
    maxAge: 500000
  }, //设置maxAge是5000ms，即5s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true,
}))
app.use(express.static(path.join(__dirname, './')));
app.use(bp.urlencoded({
  extended: false
}));


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, auth, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  if (req.method == "OPTIONS") {
    res.send(200); /*让options请求快速返回*/
  } else {
    next();
  }
});
const kinds = require('./kinds.js');
const dataLists = require('./dataLists.js')
const user = require('./user.js')

module.exports = {
  start(_port = 1000) {
    app.listen(_port);
    kinds.getData(app);
    dataLists.getData(app)
    user.getData(app)
  }
}