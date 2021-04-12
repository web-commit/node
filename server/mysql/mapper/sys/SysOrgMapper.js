// 同SysUserMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.parent_id,' +
    'a.name,' +
    'a.sort,' +
    'a.code,' +
    'a.address,' +
    'a.master,' +
    'a.phone,' +
    'a.enabled'

const where = ' where 1=1 '
const Base_Joins = ' '
const findList_Sql = function (params) {
    let sql = 'SELECT  ' + Base_Column_List + ' FROM sys_org a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    
    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_org(' +
        'id,' +
        'parent_id,' +
        'name,' +
        'sort,' +
        'code,' +
        'address,' +
        'master,' +
        'phone' +
        ') VALUES (?,?,?,?,?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.id)
    sqlParams.push(params.parentId)
    sqlParams.push(params.name)
    sqlParams.push(params.sort)
    sqlParams.push(params.code)
    sqlParams.push(params.address)
    sqlParams.push(params.master)
    sqlParams.push(params.phone)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_org a SET ' +
        'parent_id = ? ' +
        'name = ? '
        'sort = ? ' +
        'code = ? ' +
        'address = ? ' +
        'master = ? ' +
        'phone = ? ' +
        'enabled = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.parentId)
    sqlParams.push(params.name)
    sqlParams.push(params.sort)
    sqlParams.push(params.code)
    sqlParams.push(params.address)
    sqlParams.push(params.master)
    sqlParams.push(params.phone)
    sqlParams.push(params.enabled)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_org WHERE id = ?',
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
    }
}