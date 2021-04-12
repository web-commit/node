//https://segmentfault.com/a/1190000012186439
//https://blog.csdn.net/think_A_lot/article/details/93500799
const mysql = require('mysql')
const util = require('../util')

const conf = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'oscar',
  port: '3306',
  // charset: 'utf8mb4',
  multipleStatements: true    // 多语句查询
}
console.log("** Mysql " + conf.database + " start successfully!")

const pool = mysql.createPool(conf)

module.exports = {
  execSql(input) {
    console.debug("DEBUG: [SQL]   ", input.sql)
    console.debug("DEBUG: [PARAM] ", input.sqlParams)
    // console.debug("\n\n")
    // 异步改同步
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(input.sql, input.sqlParams, (err, result) => {
          if (!result) {
            console.error(err)
            reject(null)
          } else if (!util.isArray(result)) {
            resolve([])
          } else {
            let list = []
            result.forEach(row => {
              let camelRow = {}
              for (let key in row) {
                let camelKey = util.toCamel(key)
                let value = row[key]  // real value

                // check if convert datetime to string
                if (/.\d{4} \d{2}:\d{2}:\d{2} GMT\+0800 ./.test(value)) {
                  camelRow[camelKey] = util.date.utcToDate(value)
                } else {
                  camelRow[camelKey] = value
                }
              }
              list.push(camelRow)
            })
            resolve(list)
          }
          connection.release()
        })
      })
    })

  },
}
