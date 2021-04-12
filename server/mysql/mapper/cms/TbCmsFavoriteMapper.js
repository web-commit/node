const dao = require('../../db')
const Base_Column_List =
    'b.cn_name,'+
    'a.id,'+
    'a.cms_id,'+
    'a.source,'+
    'a.user_id,'+
    'a.create_time, '+
    "CASE a.source WHEN 'tb_cms_info' THEN c.name WHEN 'tb_files' THEN d.name END AS 'cmsName' "

const Base_Joins = ' LEFT JOIN sys_user b on a.user_id = b.id LEFT JOIN tb_cms_info c ON a.cms_id=c.id LEFT JOIN tb_files d ON a.cms_id=d.id '
const where = ' where 1=1 '
const findList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ' FROM tb_cms_favorite a ' + Base_Joins + where
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
        sql += ' LIMIT ' + (params.pageNum - 1) + ',' + params.pageSize
    }

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO tb_cms_favorite(' +
                    'cms_id,'+
            'source,'+
            'user_id,'+
            'create_time'+
        ') VALUES (?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.cmsId)
    sqlParams.push(params.source)
    sqlParams.push(params.userId)
    sqlParams.push(params.createTime)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE tb_cms_favorite a SET ' +
            'cms_id = ?,'+
        'source = ?,'+
        'user_id = ?,'+
        'create_time = ?'+
        ' WHERE a.id = ?'
    let sqlParams = []
    sqlParams.push(params.cmsId)
    sqlParams.push(params.source)
    sqlParams.push(params.userId)
    sqlParams.push(params.createTime)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from tb_cms_favorite WHERE id = ?',
        sqlParams: [params.id]
    }
}
const cancel_Sql = function (params) {
    return {
        sql: 'delete from tb_cms_favorite WHERE cms_id = ?',
        sqlParams: [params.cmsId]
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
    async cancel(params) {
        return await dao.execSql(cancel_Sql(params))
    },
    async exec(sqlAndParams){
        return await dao.execSql(sqlAndParams)
    }
}
