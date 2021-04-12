// 同SysUserMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.cms_id,' +
    'a.user_id,' +
    'a.openid,' +
    'a.source,' +
    'a.praise,' +
    'a.remarks,' +
    'a.create_time,' +
    'a.cn_name,' +
    'a.head_photo '

const where = ' where 1=1 '
const Base_Joins = '  '
const findList_Sql = function (params) {
    let sql = 'SELECT ' + Base_Column_List + ' FROM tb_cms_reply a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.cmsId) {
        sql += ' AND a.cms_id = ? '
        sqlParams.push(params.cmsId)
    }
    if (params.openid) {
        sql += ' AND a.openid = ? '
        sqlParams.push(params.openid)
    }
    if (params.userId) {
        sql += ' AND a.user_id = ? '
        sqlParams.push(params.userId)
    }
    if (params.source) {
        sql += ' AND a.source = ? '
        sqlParams.push(params.source)
    }

    sql += ' order by a.id desc '

    //分页
    if (params.pagination) {
        sql += ' LIMIT ' + (params.pageNum - 1)*params.pageSize + ',' + params.pageSize
    }

    return {
        sql, sqlParams
    }
}
 
const insert_Sql = function (params) {
    let sql = 'INSERT INTO tb_cms_reply(' +
        'cms_id,' +
        'user_id,' +
        'openid,' +
        'cn_name,' +
        'source,' +
        'praise,' +
        'remarks,' +
        'head_photo,' +
        'create_time' +
        ') VALUES (?,?,?,?,?,?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.cmsId)
    sqlParams.push(params.userId)
    sqlParams.push(params.openid)
    sqlParams.push(params.cnName)
    sqlParams.push(params.source)
    sqlParams.push(params.praise)
    sqlParams.push(params.remarks)
    sqlParams.push(params.headPhoto)
    sqlParams.push(params.createTime)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE tb_cms_reply a SET ' +
        'cn_name = ?, ' +
        'remarks = ?, ' +
        'head_photo = ?, ' +
        'create_time = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.cnName)
    sqlParams.push(params.remarks)
    sqlParams.push(params.headPhoto)
    sqlParams.push(params.createTime)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}


const delete_Sql = function (params) {
    return {
        sql: 'delete from tb_cms_reply WHERE id = ?',
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
    async updateRemarkByType(params) {
        return await dao.execSql(updateRemarkByType_Sql(params))
    }
}