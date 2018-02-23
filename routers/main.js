/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

/*
* 处理通用的数据
* */
var data;
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }
    //读取顶部的分类
    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});
//首页－前端分类页面的数据
router.get('/', function(req,res,next){
    data.category = req.query.category || '';//顶部分类的ID
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 10;
    data.pages = 0;

    var where = {};
    //如果有分类被点击了则传入条件中
    if (data.category) {
        where.category = data.category
    }
    Content.where(where).count().then(function(count){
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        //取值不能小于1
        data.page = Math.max( data.page, 1 );
        var skip = (data.page - 1) * data.limit;
        //安创建时间倒序,where为条件判断，即查找分类文章
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });
    }).then(function(contents){
        data.contents = contents;
        res.render('main/index', data);
    });
});

//阅读原文
router.get('/view', function(req,res,next){
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function(content){
        data.content = content;
        //阅读人++
        content.views++;
        //保存阅读数
        content.save();
        res.render('main/view',data);
    })
})
module.exports = router;