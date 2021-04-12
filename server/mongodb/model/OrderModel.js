const mongoose = require('../db')
const Schema = mongoose.Schema


const schema = new Schema({
  course: {type: Schema.Types.ObjectId, ref: 'Classs'},
  user_id: {type: Schema.Types.ObjectId, ref: 'SysUser'},
  state: {type: String, default: '未支付'}, //订单状态： 未支付 已支付 取消
  create_time: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Order', schema, 'order')
