// 同SysUserMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.parent_id,' +
    'a.type,' +
    'a.value,' +
    'a.label,' +
    'a.sort,' +
    'a.remark'

const where = ' where 1=1 '
const Base_Joins = ' '
const findList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ' FROM sys_dict a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.type) {
        sql += ' AND a.type = ? '
        sqlParams.push(params.type)
    }

    sql += 'order by a.type, a.sort'

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO sys_dict(' +
        'parent_id,' +
        'type,' +
        'value,' +
        'label,' +
        'sort,' +
        'remark' +
        ') VALUES (?,?,?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.parentId)
    sqlParams.push(params.type)
    sqlParams.push(params.value)
    sqlParams.push(params.label)
    sqlParams.push(params.sort)
    sqlParams.push(params.remark)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE sys_dict a SET ' +
        'parent_id = ?, ' +
        'type = ?, '
        'value = ?, ' +
        'label = ?, ' +
        'sort = ?, ' +
        'remark = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.parentId)
    sqlParams.push(params.type)
    sqlParams.push(params.value)
    sqlParams.push(params.label)
    sqlParams.push(params.sort)
    sqlParams.push(params.remark)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const updateRemarkByType_Sql = function (params) {
    let sql = 'UPDATE sys_dict SET remark = ? where type = ?'
    let sqlParams = []
    sqlParams.push(params.remark)
    sqlParams.push(params.type)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from sys_dict WHERE id = ?',
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
    async updateRemarkByType(params) {
        return await dao.execSql(updateRemarkByType_Sql(params))
    }
}
