const express = require('express')
const router = express.Router()
const Pusher = require('pusher')
const request = require('request')
const util = require('../../server/util')

const SysBannerService = require('../../server/mysql/mapper/sys/SysBannerMapper')
const SysDescService = require('../../server/mysql/mapper/sys/SysDescMapper')
const SysDictService = require('../../server/mysql/mapper/sys/SysDictMapper')
const SysMenuService = require('../../server/mysql/mapper/sys/SysMenuMapper')
const SysOrgService = require('../../server/mysql/mapper/sys/SysOrgMapper')
const SysRoleService = require('../../server/mysql/mapper/sys/SysRoleMapper')
const SysRoleMenuService = require('../../server/mysql/mapper/sys/SysRoleMenuMapper')
const SystemService = require('../../server/mysql/mapper/sys/SystemMapper')
const SysUserService = require('../../server/mysql/mapper/sys/SysUserMapper')
const SysUserRoleService = require('../../server/mysql/mapper/sys/SysUserRoleMapper')

router.get('/version', async(req, res) => {
    res.send(util.success({version:'express'}))
})
router.get('/code2session', async(req, res) => {
    let param = req.query
    request({
        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + param.appid + '&secret=' + param.secret + '&js_code=' + param.js_code + '&grant_type=authorization_code',
        method: 'GET',
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(util.success({data:JSON.parse(body)}))
        }else{
            console.error(error)
        }
    })
})
router.get('/sys/main/stat', async(req, res) => {
    res.send(util.success({user_count:123,module_count:222,view_count:985}))
})


/**
 * query param: req.query
 * form param :req.body
 * path param: req.params
 * header: req.get('Content-Type')
 */
router.post('/login', async (req, res, next) => {
    // console.log(req.query)
    // console.log(req.body)
    // res.send(req.body);
    //res.json(a)
    let user = req.body
    if (!user.id) user.password = util.md5(user.password)

    let list = await SysUserService.findList(user)
    if (list && list.length == 0) {
        res.send(util.warn("用户名或密码不正确"))
    } else {
        user = list[0]
        //setRoleAndOrg
        const userRoleList = await SysUserRoleService.findList({userId: user.id})
        user.roleIds = userRoleList.map(o => o.roleId)
        if (user.roleIds.length === 0) {
            console.error(`找不到用户[${user.id}]的角色`)
        }
        let roleList = await SysRoleService.findList({id: user.roleIds[0]})
        user.roleId = user.roleIds[0]
        user.roleName = roleList[0].name
		user.roleCode = roleList[0].code
        res.send(util.success({
            token: {
                token:user.id, //暂时无des
                timeout:30
            },
            user: user
        }, "登录成功"))
    }
});
router.get('/logout', async(req, res, next) => {
    res.send(util.success())
})
router.get('/sys/download', function(req, res, next) {
    res.download('./assets/' + req.query.fileName)
})
// 参考bmob.js
router.get('/sys/menu/list', async(req, res, next) => {
    const ss = function(map, list, menu){
        if(!menu) return;
        list.push(menu)
        if(menu.parentId == 0){
            return
        }
        let parent = map.get(menu.parentId)
        ss(map, list, parent)
    }
    let userId = req.get('Authorization')  //此时存的userId
    let myMenuList = await SysMenuService.findChildMenuList({userId})
    let set = new Set() //有权限的menu id
    myMenuList.forEach(menu=>{
        set.add(menu.id)
    })
    let all = await SysMenuService.findList({})
    all.forEach(menu => {
        menu.children = []
    })

    all.forEach(menu => {
        for(let i=0;i<all.length;i++){
            if(menu.parentId == all[i].id && set.has(menu.id)){ //找到parent了 && 有权限
                all[i].children.push(menu)
            }
        }
    })
    let result = []
    all.forEach(menu => {
        if(menu.id ==1 || menu.children.length > 0){ //首页或有子菜单才显示
            result.push(menu)
        }
    })

    res.send(util.success(result))
})
router.get('/sys/desc/list', async (req, res, next) => {
    let data = await SysDescService.findList({type:'system'})
    res.send(util.success(data))
})
router.get('/sys/menu/router', async (req, res, next) => {
    let all = await SysMenuService.findList({})
    let data = []
    all.forEach(menu => {
        for(let i=0;i<all.length;i++){
            if(menu.parentId == all[i].id){
                data.push({
                    path: menu.href,
                    component:menu.component,
                    meta: [all[i].name, menu.name]
                })
                break
            }
        }
    })

    res.send(util.success(data))
})

router.post('/sys/user', async(req, res, next) => {
	let user = req.body
    if(user.id){ //改密码
        if(user.newPassword){
            user.password = util.md5(user.newPassword)
        }else if(user.password && user.checkPass == user.password){
            user.password = util.md5(user.password)
        }else{
            console.log("密码输入错误:", user.password, user.checkPass, user.newPassword)
        }
    }else{
        user.password = util.md5(user.password)
    }
    await SysUserService.save(user)

	//save role
    if(!user.id){
        let list = await SysUserService.findList({
            username:user.username,
            password:user.password
        })
        if (list && list.length > 0) {
            await SysUserRoleService.save({userId:list[0].id,roleId:user.roleId})
        }
    }
    res.send(util.success())
})
router.delete('/sys/user', async(req, res) => {
    await SysUserService.delete(req.body)
    res.send(util.success())
})
router.get('/sys/user/all', async(req, res, next) => {
    let list = await SysUserService.findUserListWithRole(req.query)
    let roleIdsStr = req.query.roleIdsStr //1,2
    if(roleIdsStr){  //过滤下符合条件的role
        let roleArray = roleIdsStr.split(",")
        console.log(roleArray)
        list = list.filter(x=>{
            return roleArray.includes(x.roleId+'')
        })
    }

    res.send({
        code: 0,
        type: 'success',
        list
    })
})
router.get('/sys/user/list', async(req, res, next) => {
    let list = await SysUserService.findList(req.query)
    res.send(util.success(list))
})
router.get('/sys/role/list', async(req, res, next) => {
    let list = await SysRoleService.findList(req.query)
    res.send(util.success(list))
})
router.get('/sys/role/page', async(req, res, next) => {
    let list = await SysRoleService.pageList(req.query)
    res.send(list)
})
router.get('/sys/dict/list', async(req, res, next) => {
    let list = await SysDictService.findList(req.query)
    res.send(util.success(list))
})
router.get('/sys/dict/page', async(req, res, next) => {
    let list = await SysDictService.pageList(req.query)
    res.send(list)
})



////////////////////////cms///////////////////////
router.get('/tb/cms/notice/page', async(req, res, next) => {
    let list = await TbCmsNoticeService.pageList(req.query)
    res.send(list)
})
router.get('/tb/cms/notice/list', async(req, res, next) => {
    let list = await TbCmsNoticeService.findList(req.query)
    res.send(util.success(list))
})
router.post('/tb/cms/notice', async(req, res, next) => {
    await TbCmsNoticeService.save(req.body)
    res.send(util.success())
})
router.delete('/tb/cms/notice', async(req, res, next) => {
    await TbCmsNoticeService.delete(req.body)
    res.send(util.success())
})

router.get('/tb/cms/info/page', async(req, res, next) => {
    let list = await TbCmsInfoService.pageList(req.query)
    res.send(list)
})
router.get('/tb/cms/info/list', async(req, res, next) => {
    //查询我的收藏
    let myFavoriteList = await TbCmsFavoriteService.findList({userId: req.query.userId})
    let cmsIdSet = new Set()  //收藏的id
    myFavoriteList.forEach(x=>{
        cmsIdSet.add(x.cmsId)
    })

    let cmsList = await TbCmsInfoService.findList(req.query)
    for(let i=0;i<cmsList.length;i++){
        //通过id找comment评论表的评论
        let replyList = await TbCmsReplyService.findList({cmsId: cmsList[i].id})
        cmsList[i].replyList = replyList

        //统计收藏数
        let favoriteList = await TbCmsFavoriteService.findList({cmsId: cmsList[i].id})
        cmsList[i].favorite = favoriteList.length
        if(cmsIdSet.has(cmsList[i].id)){
            cmsList[i].inMyFavorite = true
        }
    }
    res.send(util.success(cmsList))
})
router.post('/tb/cms/info', async(req, res, next) => {
    await TbCmsInfoService.save(req.body)
    res.send(util.success())
})
router.post('/tb/cms/info/praise', async(req, res, next) => { //点赞
    let sql = 'update tb_cms_info set praise = ? where id = ?'
    let sqlParams = [req.body.praise, req.body.id]
    await TbCmsInfoService.exec({sql,sqlParams})
    res.send(util.success())
})
router.delete('/tb/cms/info', async(req, res, next) => {
    await TbCmsInfoService.delete(req.body)
    res.send(util.success())
})
router.post('/tb/cms/reply', async(req, res, next) => { //提交评论
    await TbCmsReplyService.save(req.body)
    res.send(util.success())
})
router.get('/tb/cms/reply/list', async(req, res, next) => {
    let list = await TbCmsReplyService.findList({cmsId: req.query.cmsId})
    res.send(util.success(list))
})
router.get('/tb/cms/favorite/page', async(req, res) => {
    let list = await TbCmsFavoriteService.pageList(req.query)
    res.send(list)
})
router.get('/tb/cms/favorite/list', async(req, res) => {
    let list = await TbCmsFavoriteService.findList(req.query)
    res.send(util.success(list))
})
router.post('/tb/cms/favorite', async(req, res) => {
    await TbCmsFavoriteService.save(req.body)
    res.send(util.success())
})
router.delete('/tb/cms/favorite', async(req, res) => {
    await TbCmsFavoriteService.delete(req.body)
    res.send(util.success())
})
router.delete('/tb/cms/favorite/cancel', async(req, res) => {
    await TbCmsFavoriteService.cancel(req.body)
    res.send(util.success())
})

router.post('/test', (req, res) => {
    var channels_client = new Pusher({
        appId: '858176',
        key: 'ba955953c0a25b5fae64',
        secret: 'cfc643271f3bdb6b6b55',
        cluster: 'ap3',
        encrypted: true
    });

    channels_client.trigger('hr-poll', 'hr-vote', {
        points: 1,
        hr: req.body.hr
    });
    return res.json({success: true, message: 'good job'});
});

module.exports = router;
