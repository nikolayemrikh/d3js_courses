/**
 * Модель задания
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Course = new Schema({
    courseId: {
        type: Number
    },
    // Имя курса
    name: {
        type: String
    },
    number: {
        type: Number
    },
    // Задания в курсе
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }]
});
var collectionName = 'courses';
module.exports = mongoose.model('Course', Course, collectionName);