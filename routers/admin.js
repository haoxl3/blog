/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
    if(!req.userInfo.isAdmin){
        //如果为非管理员
        res.send('对不起，只有管理员才可进入后台管理');
        return;
    }
    next();
});
router.get('/', function(req, res, next){
    //渲染的界面
    res.render('admin/index', {
        userInfo: req.userInfo
    });
})
module.exports = router;