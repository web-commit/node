const dao = require('../../db')
const Base_Column_List =
    'b.cn_name,'+
    'a.id,'+
    'a.wenjuan_id,'+
    'a.user_id,'+
    'a.content,'+
    'a.create_time,'+
    'a.score '

const Base_Joins = ' LEFT JOIN sys_user b on a.user_id = b.id '
const where = ' where 1=1 '
const findList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ' FROM tb_wenjuan_record a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.type) {
        sql += ' AND a.type = ? '
        sqlParams.push(params.type)
    }
    if (params.userId) {
        sql += ' AND a.user_id = ? '
        sqlParams.push(params.userId)
    }
    if (params.name) {
        sql += ' AND a.name LIKE "%' + params.name + '%"'
    }

    //order by

    if (params.pagination) {
        sql += ' LIMIT ' + (params.pageNum - 1)*params.pageSize + ',' + params.pageSize
    }

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO tb_wenjuan_record(' +
                    'wenjuan_id,'+
            'user_id,'+
            'content,'+
            'create_time,'+
            'score'+
        ') VALUES (?,?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.wenjuanId)
    sqlParams.push(params.userId)
    sqlParams.push(params.content)
    sqlParams.push(params.createTime)
    sqlParams.push(params.score)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE tb_wenjuan_record a SET ' +
            'wenjuan_id = ?,'+
        'user_id = ?,'+
        'content = ?,'+
        'create_time = ?,'+
        'score = ?'+
        ' WHERE a.id = ?'
    let sqlParams = []
    sqlParams.push(params.wenjuanId)
    sqlParams.push(params.userId)
    sqlParams.push(params.content)
    sqlParams.push(params.createTime)
    sqlParams.push(params.score)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from tb_wenjuan_record WHERE id = ?',
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
        for(let i=0;i<params.ids.length;i++){
            params.id = params.ids[i]
            await dao.execSql(delete_Sql(params))
        }
    },
    async exec(sqlAndParams){
        return await dao.execSql(sqlAndParams)
    }
}
