/**
 * Created by user on 2018/2/18.
 */
var mongoose = require('mongoose');

//�û��ı�ṹ
module.exports = new mongoose.Schema({
    //�û���
    username: String,
    //����
    password: String
})