// 同SysUserMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.name,' +
    'a.img_url '

const where = ' where 1=1 '
const Base_Joins = '  '
const findList_Sql = function (params) {
    let sql = 'SELECT  ' + Base_Column_List + ' FROM sys_banner a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.qs) {
        sql += ' AND a.id LIKE "%'+params.qs+'%"'
    }

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_banner(' +
        'name,' +
        'img_url' +
        ') VALUES (?,?)'
    let sqlParams = []
    sqlParams.push(params.name)
    sqlParams.push(params.imgUrl)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_banner a SET ' +
        'name = ? '+
        'img_url = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.name)
    sqlParams.push(params.imgUrl)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_banner WHERE id = ?',
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