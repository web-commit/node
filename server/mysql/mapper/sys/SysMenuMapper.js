// 同SysMenuMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.parent_id,' +
    'a.name,' +
    'a.sort,' +
    'a.href,' +
    'a.component,' +
    'a.href as "index",' +
    'a.target,' +
    'a.icon,' +
    'a.enabled '

const where = " where enabled = 'on' "
const Base_Joins = ' '
const findList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ' FROM sys_menu a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.parentId) {
        sql += ' AND a.parent_id = ? '
        sqlParams.push(params.parentId)
    }
    if (params.enabled) {
        sql += ' AND a.enabled = ? '
        sqlParams.push(params.enabled)
    }
    sql += ' order by a.id'

    return {
        sql, sqlParams
    }
}

const findChildMenuList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List +
        ' FROM sys_menu a ' +
        'JOIN sys_role_menu b ON a.id=b.menu_id ' +
        'JOIN sys_user_role c ON b.role_id = c.role_id ' +
        'JOIN sys_user d ON c.user_id = d.id ' + Base_Joins + where + ' AND a.enabled = "on" '
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.userId) {
        sql += ' AND d.id = ? '
        sqlParams.push(params.userId)
    }
    sql += ' order by a.id'

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_menu(' +
        'id,' +
        'parent_id,' +
        'name,' +
        'sort,' +
        'href,' +
        'target,' +
        'component,' +
        'icon,' +
        'enabled'+
        ') VALUES (?,?,?,?,?,?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.id)
    sqlParams.push(params.parentId)
    sqlParams.push(params.name)
    sqlParams.push(params.sort)
    sqlParams.push(params.href)
    sqlParams.push(params.target)
    sqlParams.push(params.component)
    sqlParams.push(params.icon)
    sqlParams.push(params.enabled)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_menu a SET ' +
        'id = ? ' +
        'parent_id = ? '
        'name = ? ' +
        'sort = ? ' +
        'href = ? ' +
        'target = ? ' +
        'component = ? ' +
        'icon = ? ' +
        'enabled = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.id)
    sqlParams.push(params.parentId)
    sqlParams.push(params.name)
    sqlParams.push(params.sort)
    sqlParams.push(params.href)
    sqlParams.push(params.target)
    sqlParams.push(params.component)
    sqlParams.push(params.icon)
    sqlParams.push(params.enabled)

    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_menu WHERE id = ?',
        sqlParams: [params.id]
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
    },

    async findChildMenuList(params) {
        return await dao.execSql(findChildMenuList_Sql(params))
    }
}