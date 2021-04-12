// 同SysUserMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.type,' +
    'a.name,' +
    'a.version,' +
    'a.author,' +
    'a.school,' +
    'a.remarks,' +
    'a.img_url,' +
    'a.link'

const where = ' where 1=1 '
const Base_Joins = '  '
const findList_Sql = function (params) {
    let sql = 'SELECT  ' + Base_Column_List + ' FROM sys_desc a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.name) {
        sql += ' AND a.name LIKE "%'+params.name+'%"'
    }
    if (params.type) {
        sql += ' AND a.type = ? '
        sqlParams.push(params.type)
    }

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_desc(' +
        'type,' +
        'name,' +
        'version,' +
        'author,' +
        'school,' +
        'remarks,' +
        'img_url,' +
        'link'+
        ') VALUES (?,?,?,?,?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.type)
    sqlParams.push(params.name)
    sqlParams.push(params.version)
    sqlParams.push(params.author)
    sqlParams.push(params.school)
    sqlParams.push(params.remarks)
    sqlParams.push(params.imgUrl)
    sqlParams.push(params.link)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_desc a SET ' +
        'type = ? ' +
        'name = ? '
        'version = ? ' +
        'author = ? ' +
        'school = ? ' +
        'remarks = ? ' +
        'img_url = ? ' +
        'link = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.type)
    sqlParams.push(params.name)
    sqlParams.push(params.version)
    sqlParams.push(params.author)
    sqlParams.push(params.school)
    sqlParams.push(params.remarks)
    sqlParams.push(params.imgUrl)
    sqlParams.push(params.link)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_desc WHERE id = ?',
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