/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.use(function(req, res, next){
    if(!req.userInfo.isAdmin){
        //如果为非管理员
        res.send('对不起，只有管理员才可进入后台管理');
        return;
    }
    next();
});
//首页
router.get('/', function(req, res, next){
    //渲染的界面
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});
//用户管理 
router.get('/user', function(req, res, next){
    /**
     * 从数据库中读取所有的用户,每页显示2条
     * limit为每页显示条数，skip为跳过几条数据
     */
    var page = Number(req.query.page || 1);//要显示的页
    var limit = 2;
    var pages = 0;//总页数
    //.count()可得出数据库中总记录数
    User.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page -1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        });
    });
})
module.exports = router;