const mongoose = require('../db')
const Schema = mongoose.Schema

//  用户对象模型
const schema = new Schema({
  name: {type: String, required: true},
  sex: {type: String},
  age: {type:Number},
  stature: {type:Number},
  weight: {type:Number},

  cholesterol: {type: Number},
  hdlc: {type: Number},
  smoke: {type: String},
  sbp: {type: Number},

  high_blood_pressure: {type: Number},
  low_blood_pressure: {type: Number},

  heart_disease_score: {type:Number},
  heart_disease_probability: {type:String},
  bmi: {type:Number},

  create_time: {type: Date, default: Date.now},
})

module.exports = mongoose.model('TbHealthReport', schema, 'tb_health_report')
