var mongoose = require('mongoose')
var studentScheme = require('../schemas/student')

module.exports = mongoose.model('Student', studentScheme, 'student');