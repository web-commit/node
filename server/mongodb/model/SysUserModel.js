const mongoose = require('../db')
const Schema = mongoose.Schema

//  用户对象模型
const schema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  age: {type:Number},
  create_time: {type: Date, default: Date.now},
})

// Model是由Schema编译而成的假想（fancy）构造器，具有抽象属性和行为。
// Model的每一个实例（instance）就是一个document。document可以保存到数据库和对数据库进行操作。
module.exports = mongoose.model('SysUser', schema, 'sys_user')
