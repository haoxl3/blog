/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');

//前端分类页面的数据
router.get('/', function(req,res,next){
    Category.find().then(function(categories){
        res.render('main/index',{
            userInfo: req.userInfo,
            categories: categories
        }); 
    });
});
module.exports = router;