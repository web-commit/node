const express = require('express')
const router = express.Router()
const util = require('../../server/util')

// mapper code start
const TbWenjuanRecordService = require('../../server/mysql/mapper/tb/TbWenjuanRecordMapper')
const TbWenjuanService = require('../../server/mysql/mapper/tb/TbWenjuanMapper')


// route code start
router.get('/wenjuan/record/page', async(req, res) => {
    let list = await TbWenjuanRecordService.pageList(req.query)
    res.send(list)
})
router.get('/wenjuan/record/list', async(req, res) => {
    let list = await TbWenjuanRecordService.findList(req.query)
    res.send(util.success(list))
})
router.post('/wenjuan/record', async(req, res) => {
    await TbWenjuanRecordService.save(req.body)
    res.send(util.success())
})
router.delete('/wenjuan/record', async(req, res) => {
    await TbWenjuanRecordService.delete(req.body)
    res.send(util.success())
})

router.get('/wenjuan/page', async(req, res) => {
    let list = await TbWenjuanService.pageList(req.query)
    res.send(list)
})
router.get('/wenjuan/list', async(req, res) => {
    let list = await TbWenjuanService.findList(req.query)
    res.send(util.success(list))
})
router.post('/wenjuan', async(req, res) => {
    await TbWenjuanService.save(req.body)
    res.send(util.success())
})
router.delete('/wenjuan', async(req, res) => {
    await TbWenjuanService.delete(req.body)
    res.send(util.success())
})




module.exports = router;
