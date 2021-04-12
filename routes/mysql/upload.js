var fs = require('fs');
var express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router();

var storage = multer.diskStorage({
    //上传后路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../../assets/default'))
    },
    //给上传文件重命名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({ storage: storage })

router.post('/', upload.single('file'), function (req, res, next) {
    // { fieldname: 'file',
    //     originalname: '10.jpg',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg',
    //     destination: './assets/default',
    //     filename: 'file-1583584459202.jpg',
    //     path: 'assets\\default\\file-1583584459202.jpg',
    //     size: 24775 }
    // console.log(req.file);  // single
    // console.log(req.files);  //  multiple
    res.send({
        code: 0,
        type: 'success',
        data: 'default/'+req.file.filename
    })
});

router.post('/multiple', upload.fields([{name: 'file', maxCount: 5},{name:'file1'}]), function (req, res, next) {
    //file file1都是数组
    let file = req.files['file']  // <input type="file" name="file" multiple>
    let file1 = req.files['file1'] //<input type="file1" name="file" multiple>

    res.send({
        code: 0,
        type: 'success',
        data: 'default/'+file[0].filename
    })
});

module.exports = router;
