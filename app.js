//加载express模块
var express = require('express');
//创建app应用=>NodeJs Http.createServer()
var app = express();
/*
* 首页
* */
app.get('/',function(req,res,next){
    res.send('<h1>hello world</h1>')
})
//监听http请求
app.listen(8081)