/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next){
    res.render('main/index',{
        userInfo: req.userInfo 
    });
});
module.exports = router;