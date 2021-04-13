const mongoose = require('../db')
const Schema = mongoose.Schema

//  用户对象模型
const schema = new Schema({
  name: {type: String, required: true},
  sex: {type: String},
  age: {type:Number},
  eyesight: {type:Number},
  stature: {type:Number},
  weight: {type:Number},
  blood_pressure: {type: String},
  blood_glucose: {type: String},
  blood_fat: {type: String},
  cholesterol: {type: Number},
  hdlc: {type: Number},
  smoke: {type: String},
  sbp: {type: Number},

  framingham: {type:Number},
  bmi: {type:Number},
  diagnosis: {type: String},
  proposal: {type: String},
  create_time: {type: Date, default: Date.now},
})

module.exports = mongoose.model('TbHealthReport', schema, 'tb_health_report')
