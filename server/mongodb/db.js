const mongoose = require('mongoose')
try {
  mongoose.connect('mongodb://127.0.0.1:27017/react_student_health',{ useNewUrlParser: true },function(err){
    if(err){
      // console.log(err)
    }else{
      console.log('** Mongodb connect successfully!')
    }
  })
}catch (e) {
  console.error(e)
}
module.exports = mongoose
