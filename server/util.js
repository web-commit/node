const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const crypto = require('crypto')

const dateFormat = function(fmt, date){
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

// npm install crypto
const md5 = password => {
    if (!password) {
        return ''
    } else {
        return crypto.createHash('md5').update(password + 'kid309xL_%A43cs1').digest("hex")
    }
}

module.exports = {
    propertyIsNotEmpty(obj, property){//对象中是否存在属性
        console.log(obj)
        console.log(property)
        if((property in obj) && obj[property]){
            return true
        }else{
            return false
        }
    },
    toCamel(str){ //to 驼峰 convert parent_id to parentId
        return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
            return $1 + $2.toUpperCase()
        })
    },
    toUnderScoreCase(str){ // to 下划线
        return str.replace(/([A-Z])/g,"_$1").toLowerCase()
    },
    convertObject(obj){

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
    },
    isArray(o){
        return Object.prototype.toString.call(o) === '[object Array]'
    },
    date:{
        utcToDate(str){ //2019-11-03T11:41:56.000Z
            let d = new Date(str)
            return dateFormat('YYYY-mm-dd HH:MM:SS',d)
        },
    },
    warn(message){
        return {
            code: 1,
            type: 'warning',
            message: message
        }
    },
    success(data,message = '操作成功'){
        return {
            code: 0,
            type: 'success',
            message,
            data
        }
    },
    objectId(id){
        return new ObjectId(id)
    },
    md5
}
