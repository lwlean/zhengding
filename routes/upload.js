var express = require('express');
var multiparty = require('multiparty');
var fs = require('fs');
var os = require('os');
var router = express.Router();
var Student = require('../model/Student');

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
                        // console.log(stu);
                        if(stu.indexOf(',') < 0) continue;
                        var tempStu = new Student();
                        tempStu.name = stu.split(',')[0];
                        tempStu.weight = Number.parseFloat(stu.split(',')[1]);
                        tempStu.class = fileName;
                        // 先查询再插入
                        const stuFind = queryStu(tempStu.name);
                        console.log('fild stuFind', stuFind);
                        
                        // tempStu.save((err) => {
                        //     if (err){
                        //         console.log('save student err', err);
                        //     } else {
                        //         console.log('save student success:');
                        //     }
                        // });
                    }
                    new Promise((resolve, reject) => {
                        resolve('read over!!!');
                    });
                });
            }).then((msg) => {
                console.log(msg);
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

 async function queryStu(name){
    var stu = await Student.findOne({ name: name});
    console.log('find stuent:', stu);
    return stu;
 } 