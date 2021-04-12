// 同SystemMapper.xml
const dao = require('../../db')
module.exports = { //类似于Dao
    async findList(sql) {
        return await dao.execSql({sql,sqlParams:[]})
    },
    async createTable(sql) {
        return await dao.execSql({sql,sqlParams:[]})
    }
}