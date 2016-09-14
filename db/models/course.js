/**
 * Модель задания
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Course = new Schema({
    courseId: {
        type: Number,
        unique: true
    },
    // Имя курса
    name: {
        type: String
    },
    // Задания в курсе
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }]
});
var collectionName = 'courses';
module.exports = mongoose.model('Course', Course, collectionName);