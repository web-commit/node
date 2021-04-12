const mongoose = require('../db')
const Schema = mongoose.Schema

//  用户对象模型
const schema = new Schema({
  name: {type: String, required: true},
  age: {type:Number},
  stature: {type:Number},
  weight: {type:Number},
  blood_pressure: {type: String},
  blood_glucose: {type: String},
  blood_fat: {type: String},
  diagnosis: {type: String},
  proposal: {type: String},
  create_time: {type: Date, default: Date.now},
})

module.exports = mongoose.model('TbHealthReport', schema, 'tb_health_report')
