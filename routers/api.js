/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();
//引入user模型,相当于有了个User构造函数
var User = require('../models/User');

//统一返回格式
var responseData;
router.use(function(req, res, next){
    responseData = {
        code: 0,
        message: ''
    }
    next();
});

/*
 * 用户注册
 * 1.用户名、密码不能为空
 * 2.两次密码一致
 * */
router.post('/user/register', function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    //用户名是否为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //密码不能为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次输入的密码不一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }
    //从数据库中判断某用户是否注册,findOne为mongoose中的API，返回promise对象
    User.findOne({
        username: username 
    }).then(function(userInfo){
        if(userInfo){
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo){
        responseData.message = '注册成功';
        res.json(responseData);
    });
});
module.exports = router;