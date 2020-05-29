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

module.exports = router;