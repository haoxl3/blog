/**
 * Created by user on 2018/2/18.
 */
var express = require('express');
var router = express.Router();

//�û�ע��
router.post('/user/register', function(req,res,next){
    console.log('register')
});
module.exports = router;