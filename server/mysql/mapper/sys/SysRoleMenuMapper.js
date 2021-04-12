// 同SysRoleMenuMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.role_id,' +
    'a.menu_id'

const where = ' where 1=1 '
const Base_Joins = ' '
const findList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ' FROM sys_role_menu a ' + Base_Joins + where
    let sqlParams = []
    if (params.menuId) {
        sql += ' AND a.menu_id = ? '
        sqlParams.push(params.menuId)
    }

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_role_menu(' +
        'role_id,' +
        'menu_id' +
        ') VALUES (?,?)'
    let sqlParams = []
    sqlParams.push(params.roleId)
    sqlParams.push(params.menuId)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_role_menu a SET ' +
        'role_id = ? ' +
        'menu_id = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.roleId)
    sqlParams.push(params.menuId)

    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_role_menu WHERE role_id = ?',
        sqlParams: [params.roleId]
    }
}

module.exports = { //类似于Dao
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
