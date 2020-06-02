var express = require('express');
var multiparty = require('multiparty');
var fs = require('fs');
var os = require('os');
var router = express.Router();
var Student = require('../model/Student');

const UploadStu = async (oPath, nPath, fileName,res) => {
    try {
        var newFilePath = await RenameFile(oPath, nPath);
        await ReadUploadFile(newFilePath, fileName, res);
        await UploadSuccess(res);
    } catch (e) {
        e();
        res.send({code: 500});
    }
}

const RenameFile = (oldPath, newPath) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.log('rename error')
                reject(() => console.log('rename file error'));
            }
            resolve(newPath);
        });
    });
}

const UploadSuccess = async (res) => {
    console.log('upload success!!!');
    res.send({code: 200});
} 

const ReadUploadFile = (newPath, fileName, res) => {
    return new Promise((resolve, reject) => {
        try{
            fs.readFile(newPath, 'utf-8', (err, data) => {
                if (err) {
                    reject(() => console.log('read file error'));
                }
                for(let stu of data.split('\r\n')){
                    if (stu.trim() === null || stu.trim() === ''){
                        console.log('empty line >>>>>>>>>>>>');
                        continue;
                    }
                    if(stu.indexOf(',') < 0) continue;
                    // let tempStu = new Student();
                    let name = stu.split(',')[0];
                    let weight = Number.parseFloat(stu.split(',')[1]);
                    let stu_class = fileName;
                    
                    Student.findOneAndRemove({name: name}).then(() => {
                        console.log('remove successs');
                        let tempStu = new Student();
                        tempStu.name = name;
                        tempStu.weight = weight;
                        tempStu.class = stu_class;
                        tempStu.save().then(() => {
                            console.log('save success name is', name);
                        }).catch(() => {
                            reject(() => { console.log('save faild err'); });
                            console.log('save faild err');
                        });
                    }).catch(() => { 
                        reject(() => console.log('remove error >>>>'));
                        console.log('rmove error >>>');
                    });
                }
                resolve();
            });
        } catch (e) {
            reject(() => {'read file error >>>'});
        }
        
    })
}

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
            }
            console.log('parse success');
            var filePath = files.file[0].path;
            var fileName = files.file[0].originalFilename;
            var savePath = './temp/' + fileName
            UploadStu(filePath, savePath, fileName, res);
        });
        
    }catch(e){
        console.log('upload error:',e);
        console.log(e);
        res.send({'code': '500'});
    }
  });

  module.exports = router;