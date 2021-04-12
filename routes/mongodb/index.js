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

router.post('/tb/health/report', async (req, res, next) => {
  const result = await TbHealthReportModel(req.body).save()
  res.send(util.success(result))
})

router.get('/tb/health/report', async (req, res, next) => {
  console.log("/tb/health/report", req.query)
  const list = await TbHealthReportModel.find({})
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
