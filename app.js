//加载express模块
var express = require('express');
var mongoose = require('mongoose');
//加载模板
var swig = require('swig');
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');
//创建app应用=>NodeJs Http.createServer()
var app = express();

//bodyparser设置
app.use(bodyParser.urlencoded({extended: true}));
//设置静态文件托管,当用户访问URL以/public开始，那么将直接返回publick下文件
app.use('/public',express.static(__dirname+'/public'));

//配置应用模板
//定义当前应用所使用模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views,第二个参数是目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine,第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine','html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
/*
 * 首页
 * */
app.get('/',function(req,res,next){
    //res.send('<h1>hello world</h1>')
    /*
     * 读取views目录下的指定文件，解析并返回给客户端
     * 第一个参数：表示模板的文件，相对于views目录 views/index.html
     * 第二个参数：传递给模板使用的数据
     * */
    res.render('index');
});

//连接数据库
mongoose.connect('mongodb://localhost:27017/blog', function(err){
    if(err){
        console.log('fail');
    }else{
        console.log('success');
        //监听http请求
        app.listen(8081)
    }
});