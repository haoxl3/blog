/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();

router.get('/user', function(req,res,next){
    res.send('admin User');
});
module.exports = router;