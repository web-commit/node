// 同SysRoleMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.name,' +
    'a.code,' +
    'a.enabled'

const where = ' where 1=1 '
const Base_Joins = '  '
const findList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ' FROM sys_role a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.name) {
        sql += ' AND a.name = ? '
        sqlParams.push(params.name)
    }

    return {
        sql, sqlParams
    }
}

const findRoleMenuList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ',GROUP_CONCAT(b.menu_id) as "menuIdsStr" ' +
        'FROM sys_role a LEFT JOIN sys_role_menu b ON a.id = b.role_id ' +
        'GROUP BY a.id '
    let sqlParams = []

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_role(' +
        'id,' +
        'name,' +
        'code,' +
        'enabled' +
        ') VALUES (?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.id)
    sqlParams.push(params.name)
    sqlParams.push(params.code)
    sqlParams.push(params.enabled)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_role a SET ' +
        'id = ? ' +
        'name = ? '
        'code = ? ' +
        'enabled = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.id)
    sqlParams.push(params.name)
    sqlParams.push(params.code)
    sqlParams.push(params.enabled)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_role WHERE id = ?',
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
    async insert(params) {
        return await dao.execSql(insert_Sql(params))
    },
    async update(params) {
        return await dao.execSql(update_Sql(params))
    },
    async delete(params) {
        for(let i=0;i<params.ids.length;i++){
            params.id = params.ids[i]
            await dao.execSql(delete_Sql(params))
        }
    }
}
