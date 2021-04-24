const express = require('express')
const router = express.Router()
const util = require('../../server/util')
const Order = require('../../server/mongodb/model/OrderModel')
const SysUser = require('../../server/mongodb/model/SysUserModel')
const TbHealthReportModel = require('../../server/mongodb/model/TbHealthReportModel')

/**
 * query param: req.query
 * form param :req.body
 * path param: req.params
 * header: req.get('Content-Type')
 */


router.post('/user', async (req, res, next) => {
  const param = req.body
  param.course = util.objectId()
  const result = await new Order(param).save()
  console.log(result)
  res.send(util.success(result.data))
})

// 分析 给出病情和建议
router.post('/tb/health/report', async (req, res, next) => {
  const param = util.convertObject(req.body)

  const calcAgeScore = age => {
    let score = 0
    if(age>=20 && age <= 34){
      score = -9
    }else if(age>=35 && age <= 39){
      score = -4
    }else if(age>=40 && age <= 44){
      score = 0
    }else if(age>=45 && age <= 49){
      score = 3
    }else if(age>=50 && age <= 54){
      score = 6
    }else if(age>=55 && age <= 59){
      score = 8
    }else if(age>=60 && age <= 64){
      score = 10
    }else if(age>=65 && age <= 69){
      score = 11
    }else if(age>=70 && age <= 74){
      score = 12
    }else if(age>=75 && age <= 79){
      score = 13
    }
    return score
  }
  const calcCholesterolScore = (cholesterol,age) =>{
    let score = 0
    if(cholesterol<160){
      score = 0
    }else if(cholesterol>=160 && cholesterol<=199){
      if(age >= 20 && age<=39){
        score = 4
      }else if(age >= 40 && age<=49){
        score = 3
      }else if(age >= 50 && age<=59){
        score = 2
      }else if(age >= 60 && age<=69){
        score = 1
      }else if(age >= 70 && age<=79){
        score = 0
      }
    }else if(cholesterol>=200 && cholesterol<=239){
      if(age >= 20 && age<=39){
        score = 7
      }else if(age >= 40 && age<=49){
        score = 5
      }else if(age >= 50 && age<=59){
        score = 3
      }else if(age >= 60 && age<=69){
        score = 1
      }else if(age >= 70 && age<=79){
        score = 0
      }
    }else if(cholesterol>=240 && cholesterol<=279){
      if(age >= 20 && age<=39){
        score = 9
      }else if(age >= 40 && age<=49){
        score = 6
      }else if(age >= 50 && age<=59){
        score = 4
      }else if(age >= 60 && age<=69){
        score = 2
      }else if(age >= 70 && age<=79){
        score = 1
      }
    }else if(cholesterol>=280){
      if(age >= 20 && age<=39){
        score = 11
      }else if(age >= 40 && age<=49){
        score = 8
      }else if(age >= 50 && age<=59){
        score = 5
      }else if(age >= 60 && age<=69){
        score = 3
      }else if(age >= 70 && age<=79){
        score = 1
      }
    }

    return score
  }
  const calcHDLCScore = hdlc =>{
    let score = 0
    if(hdlc >= 60){
      score = -1
    }else if(hdlc >= 50 && hdlc <= 59){
      score = 0
    }else if(hdlc >= 40 && hdlc <= 49){
      score = 1
    }else if(hdlc <40){
      score = 2
    }
    return score
  }
  const calcSBPScore = sbp =>{
    let score = 0
    if(sbp < 120){
      score = 0
    }else if(sbp >= 120 && sbp <= 129){
      score = 1
    }else if(sbp >= 130 && sbp <= 139){
      score = 2
    }else if(sbp >= 140 && sbp <= 149){
      score = 2
    }else if(sbp >= 160){
      score = 3
    }
    return score
  }
  const calcSmokeScore = (smoke,age)=>{
    let score = 0
    if(age >= 20 && age<=39){
      score = smoke == 'Y' ? 8 : 0
    }else if(age >= 40 && age<=49){
      score = smoke == 'Y' ? 5 : 0
    }else if(age >= 50 && age<=59){
      score = smoke == 'Y' ? 3 : 0
    }else if(age >= 60 && age<=69){
      score = smoke == 'Y' ? 1 : 0
    }else if(age >= 70 && age<=79){
      score = smoke == 'Y' ? 1 : 0
    }

    return score
  }

  // sbp收缩压 cholesterol胆固醇
  const {age, cholesterol,hdlc,smoke,sbp} = param

  let totalScore = calcAgeScore(age)
      + calcCholesterolScore(cholesterol,age)
      + calcHDLCScore(hdlc)
      + calcSBPScore(sbp)
      + calcSmokeScore(smoke,age)

  // 冠心病总分
  param.heart_disease_score = totalScore
  if(totalScore < 0){
    param.heart_disease_probability = '<1%'
  }else if(totalScore >=17){
    param.heart_disease_probability = '>=30%'
  }else{
    const p = ['1%','1%','1%','1%','1%','2%','2%','3%','4%','5%','6%','8%','10%','12%','16%','20%','25%']
    param.heart_disease_probability = p[totalScore]
  }

  //体重指数(BMI)=体重(kg)÷身高(m)^2
  let height = param.stature / 100
  param.bmi = (param.weight / (height*height)).toFixed(2)

  const result = await TbHealthReportModel(param).save()
  res.send(util.success(result))
})

router.get('/tb/health/report', async (req, res, next) => {
  let param = {username: req.query.username}
  if(req.query._id){
    param["_id"] = util.objectId(req.query._id)
  }
  if(req.query.createTimeArray && req.query.createTimeArray.length == 2){
    let start = req.query.createTimeArray[0]
    let end = req.query.createTimeArray[1]
    start = start.substring(1,11) + " " + start.substring(12,20)
    end = end.substring(1,11) + " " + end.substring(12,20)
    param.create_time = {
      $gte: new Date(start),
      $lt: new Date(end)
    }
  }
  const list = await TbHealthReportModel.find(param).sort({create_time:1})
  res.send(util.success(list))
})

router.post('/login', async (req, res, next) => {
  let user = req.body
  if (!user.id) user.password = util.md5(user.password)

  const q = {
    username: user.username,
    password: user.password
  }

  const list = await SysUser.find(q)
  if (list && list.length == 0) {
    res.send(util.warn("用户名或密码不正确"))
  } else {
    res.send(util.success({
      token: {
        token: user.id, //暂时无des
        timeout: 30
      },
      user: user
    }, "登录成功"))
  }
});

module.exports = router
