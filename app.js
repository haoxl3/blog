//����expressģ��
var express = require('express');
//����appӦ��=>NodeJs Http.createServer()
var app = express();
/*
* ��ҳ
* */
app.get('/',function(req,res,next){
    res.send('<h1>hello world</h1>')
})
//����http����
app.listen(8081)