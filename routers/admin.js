/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

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
});

/*
* 分类首页
* */
router.get('/category', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        /*
        * 1: 升序
        * -1: 降序
        * */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

//添加分类
router.get('/category/add', function(req, res){
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

//分类的保存
router.post('/category/add', function(req, res){
    var name = req.body.name || '';
    if(name == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }
    //查找数据库中是否已经存在此同名分类
    Category.findOne({
        name: name 
    }).then(function(rs){
        if(rs){
            //已经存在该分类了
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类已经存在了'
            })
            return Promise.reject();
        }else{
            //数据库中不存在该分类，可保存
            return new Category({
                name: name 
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        })
    });
});

//分类的修改
router.get('/category/edit', function(req, res, next){
    //获取要修改的分类的信息
    var id = req.query.id || '';
    //获取要修改的分类信息
    Category.findOne({
        _id: id 
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category: category
            });
        }
    })
});
//分类的修改保存
router.post('/category/edit', function(req, res, next){
    var id = req.query.id || '';
    var name = req.body.name || '';
    //获取要修改的分类信息
    Category.findOne({
        _id: id 
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        }else{
            //要修改的分类名称是否已经在数据库存在 
            //当用户没有做任何修改提交时要判断
            if(name == category.name){
                res.render('admin/success',{
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            }else{
                //判断修改后的名称是否存在,id不一样，但名称一样
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            }); 
            return Promise.reject();
        }else{
            return Category.update({
                _id: id
            },{
                name: name 
            })
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })
});

//分类删除
router.get('/category/delete', function(req, res){
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message:'删除成功',
            url: '/admin/category'
        });
    });
});

//内容首页
router.get('/content', function(req, res) {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then(function(count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );
        var skip = (page - 1) * limit;

        Content.find().limit(limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        }).then(function(contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});
//内容添加页面
router.get('/content/add', function(req, res){
    //显示分类
    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories: categories
        })
    })
});
//内容保存
router.post('/content/add',function(req,res){
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    });
})
module.exports = router;