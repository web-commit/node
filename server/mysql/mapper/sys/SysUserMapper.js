// 同SysUserMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.org_id,' +
    'a.username,' +
    'a.password,' +
    'a.cn_name,' +
    'a.age,' +
    'a.sex,' +
    'a.mobile,' +
    'a.email,' +
    'a.qq,' +
    'a.wechat,' +
    'a.address,' +
    'a.head_photo,' +
    'a.create_time,' +
    'a.openid,' +
    'a.country,' +
    'a.ext1,' +
    'a.ext2'

const where = ' where 1=1 '
const Base_Joins = ' left join sys_org b on a.org_id = b.id left join sys_user_role c ON a.id = c.user_id '
const findList_Sql = function (params) {
    let sql = 'SELECT c.role_id, b.name as "orgName", ' + Base_Column_List + ' FROM sys_user a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.username) {
        sql += ' AND a.username = ? '
        sqlParams.push(params.username)
    }
    if (params.openid) {
        sql += ' AND a.openid = ? '
        sqlParams.push(params.openid)
    }
    if (params.roleId) {
        sql += ' AND c.role_id = ? '
        sqlParams.push(params.roleId)
    }
    if (params.cnName) {
        sql += ' AND a.cn_name = ? '
        sqlParams.push(params.cnName)
    }
    if (params.password) {
        sql += ' AND a.password = ? '
        sqlParams.push(params.password)
    }

    //分页
    if (params.pagination) {
        sql += ' LIMIT ' + (params.pageNum - 1)*params.pageSize + ',' + params.pageSize
    }

    return {
        sql, sqlParams
    }
}

const findUserListWithRole_Sql = function (params) {
    let sql = 'SELECT c.name as "orgName", ' + Base_Column_List + ',b.role_id ' +
        'FROM sys_user a LEFT JOIN sys_user_role b ON a.id = b.user_id LEFT JOIN sys_org c on a.org_id = c.id where 1=1 '
    let sqlParams = []

	if (params.cnName) {
        sql += ' AND a.cn_name = ? '
        sqlParams.push(params.cnName)
    }

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_user(' +
        'org_id,' +
        'username,' +
        'password,' +
        'cn_name,' +
        'sex,' +
        'age,' +
        'mobile,' +
        'email,' +
        'qq,' +
        'wechat,' +
        'address,' +
        'head_photo,' +
        'create_time,' +
        'openid,' +
        'country,' +
        'ext1,' +
        'ext2' +
        ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.orgId)
    sqlParams.push(params.username)
    sqlParams.push(params.password)
    sqlParams.push(params.cnName)
    sqlParams.push(params.sex)
    sqlParams.push(params.age)
    sqlParams.push(params.mobile)
    sqlParams.push(params.email)
    sqlParams.push(params.qq)
    sqlParams.push(params.wechat)
    sqlParams.push(params.address)
    sqlParams.push(params.headPhoto)
    sqlParams.push(params.createTime)
    sqlParams.push(params.openid)
    sqlParams.push(params.country)
    sqlParams.push(params.ext1)
    sqlParams.push(params.ext2)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_user a SET ' +
        'org_id = ?, ' +
        'username = ?, '
    if (params.password) {
        sql += 'password = ?, '
    }
    sql += 'cn_name = ?, ' +
        'sex = ?, ' +
        'age = ?, ' +
        'mobile = ?, ' +
        'email = ?, ' +
        'qq = ?, ' +
        'wechat = ?, ' +
        'address = ?, ' +
        'head_photo = ?, ' +
        'openid = ?, ' +
        'country = ?, ' +
        'ext1 = ?, ' +
        'ext2 = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.orgId)
    sqlParams.push(params.username)
    if (params.password) {
        sqlParams.push(params.password)
    }
    sqlParams.push(params.cnName)
    sqlParams.push(params.sex)
    sqlParams.push(params.age)
    sqlParams.push(params.mobile)
    sqlParams.push(params.email)
    sqlParams.push(params.qq)
    sqlParams.push(params.wechat)
    sqlParams.push(params.address)
    sqlParams.push(params.headPhoto)
    sqlParams.push(params.openid)
    sqlParams.push(params.country)
    sqlParams.push(params.ext1)
    sqlParams.push(params.ext2)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_user WHERE id = ?',
        sqlParams: [params.id]
    }
}

module.exports = { //类似于Dao
    async pageList(params) {
        // total,pageNum,pageSize,size:res.length,
        let all = await dao.execSql(findList_Sql(params))
        params.pagination = true
        let page = await dao.execSql(findList_Sql(params))
        return {
            code: 0,
            type: 'success',
            message: '操作成功',
            total: all.length,
            size: page.length,
            pageNum: parseInt(params.pageNum),
            pageSize: parseInt(params.pageSize),
            list:page
        }
    },
    async findList(params) {
        return await dao.execSql(findList_Sql(params))
    },
    async findUserListWithRole(params) {
        return await dao.execSql(findUserListWithRole_Sql(params))
    },
    async save(params) {
        if(params.id){
            params.updateTime = new Date()
            await dao.execSql(update_Sql(params))
        }else{
            params.createTime = new Date()
            await dao.execSql(insert_Sql(params))
        }
    },
    async delete(params) {
        if(!params.ids) {
            params.ids = params.id ? [params.id] : []
        }

        for(let i=0;i<params.ids.length;i++){
            params.id = params.ids[i]
            await dao.execSql(delete_Sql(params))
        }
    },
    async exec(sqlAndParams){
        return await dao.execSql(sqlAndParams)
    }
}
