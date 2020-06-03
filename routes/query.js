var express = require('express');
var router = express.Router();

var Student = require('../model/Student');

router.post('/', function(req, res, next) {
    try{
        var stu_name = req.body.name||"";
        var class_name = req.body.class||"";
        Student.find({ name: {$regex: stu_name}, class:{$regex: class_name}}).then((docs) => {
            console.log('len:'+docs.length); 
            var docs_str = JSON.stringify(docs);           
            console.log(docs_str);
            res.send(docs);
        })  
    } catch(e) {
        console.log('error..' + e);
    }
});

router.post('/studentNames', function(req, res, next) {
    try {
        const queryClass = req.body.class;
        if (queryClass === null || queryClass === '') {
            res.send({});
            return;
        }
        console.log(queryClass);
        Student.find({class:{$regex: queryClass}}).then((docs) => {
            // console.log(JSON.stringify(docs));
            var rstStuNames = [];
            for (let stu of docs) {
                rstStuNames.push(stu.name);
            }
            console.log(rstStuNames.toString());
            res.send({stuNames: rstStuNames});
        }).catch(() => {
            console.log('query student name by class catch error');
            res.send({});
        })
    } catch (e){
        console.log('query student name by class error:%s', e);
    }
});

module.exports = router;