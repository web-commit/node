// 同SysUserMapper.xml
const dao = require('../../db')
const Base_Column_List =
    'a.id,' +
    'a.type,' +
    'a.category,' +
    'a.name,' +
    'a.img_url,' +
    'a.praise,' +
    'a.user_id,' +
    'a.openid,' +
    'a.head_photo,' +
    'a.cn_name,' +
    'a.create_time, ' +
    'a.remarks '

const where = ' where 1=1 '
const Base_Joins = '  '
const findList_Sql = function (params) {
    let sql = 'SELECT  ' + Base_Column_List + ' FROM tb_cms_info a ' + Base_Joins + where
    let sqlParams = []
    if (params.id) {
        sql += ' AND a.id = ? '
        sqlParams.push(params.id)
    }
    if (params.category) {
        sql += ' AND a.category = ? '
        sqlParams.push(params.category)
    }
    if (params.type) {
        sql += ' AND a.type = ? '
        sqlParams.push(params.type)
    }

    if (params.name) {
        sql += ' AND a.name LIKE "%' + params.name + '%"'
    }

    //分页
    if (params.pagination) {
        sql += ' LIMIT ' + (params.pageNum - 1)*params.pageSize + ',' + params.pageSize
    }

    return {
        sql, sqlParams
    }
}

const insert_Sql = function (params) {
    let sql = 'INSERT INTO tb_cms_info(' +
        'type,' +
        'category,' +
        'name,' +
        'img_url,' +
        'praise,' +
        'user_id,' +
        'openid,' +
        'head_photo,' +
        'cn_name,' +
        'create_time, ' +
        'update_time, ' +
        'remarks' +
        ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
    let sqlParams = []
    sqlParams.push(params.type)
    sqlParams.push(params.category)
    sqlParams.push(params.name)
    sqlParams.push(params.imgUrl)
    sqlParams.push(params.praise)
    sqlParams.push(params.userId)
    sqlParams.push(params.openid)
    sqlParams.push(params.headPhoto)
    sqlParams.push(params.cnName)
    sqlParams.push(params.createTime)
    sqlParams.push(params.updateTime)
    sqlParams.push(params.remarks)

    return {
        sql, sqlParams
    }
}

const update_Sql = function (params) {
    let sql = 'UPDATE tb_cms_info a SET ' +
        'name = ?, ' +
        'img_url = ?, ' +
        'remarks = ?, ' +
        'update_time = ? ' +
        'where a.id = ?'
    let sqlParams = []
    sqlParams.push(params.name)
    sqlParams.push(params.imgUrl)
    sqlParams.push(params.remarks)
    sqlParams.push(params.updateTime)
    sqlParams.push(params.id)

    return {
        sql, sqlParams
    }
}

const delete_Sql = function (params) {
    return {
        sql: 'delete from tb_cms_info WHERE id = ?',
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