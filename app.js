//����expressģ��
var express = require('express');
var mongoose = require('mongoose');
//����ģ��
var swig = require('swig');
//����appӦ��=>NodeJs Http.createServer()
var app = express();

//���þ�̬�ļ��й�,���û�����URL��/public��ʼ����ô��ֱ�ӷ���publick���ļ�
app.use('/public',express.static(__dirname+'/public'));

//����Ӧ��ģ��
//���嵱ǰӦ����ʹ��ģ������
//��һ��������ģ����������ƣ�ͬʱҲ��ģ���ļ��ĺ�׺���ڶ���������ʾ���ڽ�������ģ�����ݵķ���
app.engine('html', swig.renderFile);
//����ģ���ļ���ŵ�Ŀ¼����һ������������views,�ڶ���������Ŀ¼
app.set('views','./views');
//ע����ʹ�õ�ģ�����棬��һ������������view engine,�ڶ���������app.engine��������ж����ģ����������ƣ���һ����������һ�µ�
app.set('view engine','html');
//�ڿ��������У���Ҫȡ��ģ�建��
swig.setDefaults({cache: false});

//���ݲ�ͬ�Ĺ��ܻ���ģ��
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
/*
* ��ҳ
* */
app.get('/',function(req,res,next){
    //res.send('<h1>hello world</h1>')
    /*
    * ��ȡviewsĿ¼�µ�ָ���ļ������������ظ��ͻ���
    * ��һ����������ʾģ����ļ��������viewsĿ¼ views/index.html
    * �ڶ������������ݸ�ģ��ʹ�õ�����
    * */
    res.render('index');
});

//�������ݿ�
mongoose.connect('mongodb://localhost:27017/blog', function(err){
    if(err){
        console.log('fail');
    }else{
        console.log('success');
        //����http����
        app.listen(8081)
    }
});