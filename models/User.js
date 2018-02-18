/**
 * Created by user on 2018/2/18.
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
module.exports = mongoose.model('User', usersSchema);