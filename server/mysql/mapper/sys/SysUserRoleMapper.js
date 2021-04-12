// 同SysUserRoleMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.user_id,' +
    'a.role_id'

const where = ' where 1=1 '
const Base_Joins = ' '
const findList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ' FROM sys_user_role a ' + Base_Joins + where
    let sqlParams = []
    if (params.roleId) {
        sql += ' AND a.role_id = ? '
        sqlParams.push(params.roleId)
    }
    if (params.userId) {
        sql += ' AND a.user_id = ? '
        sqlParams.push(params.userId)
    }

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_user_role(' +
        'user_id,' +
        'role_id' +
        ') VALUES (?,?)'
    let sqlParams = []
    sqlParams.push(params.userId)
    sqlParams.push(params.roleId)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_user_role a SET ' +
        'user_id = ? ' +
        'role_id = ? ' +
        'where a.role_id = ?'
    let sqlParams = []
    sqlParams.push(params.userId)
    sqlParams.push(params.roleId)

    sqlParams.push(params.roleId)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_user_role WHERE user_id = ?',
        sqlParams: [params.userId]
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
        for(let i=0;i<params.ids.length;i++){
            params.id = params.ids[i]
            await dao.execSql(delete_Sql(params))
        }
    }
}
