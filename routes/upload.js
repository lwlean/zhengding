var express = require('express');
var multiparty = require('multiparty');
var fs = require('fs');
var os = require('os');
var router = express.Router();

router.post('/', function(req, res, next) {
    try{
        console.log('into file update....');
        var form = new multiparty.Form();
        form.autoFiles = true;
        form.uploadDir = `./temp/`;
        form.parse(req, function(err, fields, files) {
            if (err){
                console.log('parse error');
                res.send({code: 500});
                return;
            }else {
                console.log('parse success');
            }
            var filePath = files.file[0].path;
            var fileName = files.file[0].originalFilename;
            var savePath = './temp/' + fileName
            new Promise((resolve, reject) => {
                fs.rename(filePath, savePath, (err) => {
                    if (err) {
                        reject('renmae error')
                        return;
                    }
                    resolve(savePath);
                });
            }).then((newPath) => {
                fs.readFile(newPath, 'utf8', (err, data) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    // console.log(data);
                    var stuArr = [];
                    
                    for(let stu of data.split('\r\n')){
                        let student = {};
                        if (stu.trim() === null || stu.trim() === ''){
                            console.log('empty line >>>>>>>>>>>>');
                            continue;
                        }
                        console.log(stu);
                        if(stu.indexOf(',') < 0) continue;
                        let name = stu.split(',')[0];
                        let weight = stu.split(',')[1];
                        student.name = name;
                        student.weight = weight;
                        student.class = '5班';
                        stuArr.push(student);
                    }
                    console.log('read over!!!');
                    console.log(stuArr);
                });
            }).catch((rst) => {
                console.log(rst);
                res.send({code: 500});
            })
            
            
        });
        
    }catch(e){
        console.log('upload error:',e);
        console.log(e);
        res.send({'code': '500'});
    }
  });
  
  module.exports = router;