/**
 * Модель курсов
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Course = new Schema({
    // Номер
    number: {
        type: Number
    },
    // Название задания
    taskName: {
        type: String
    },
    // Краткое описание задания
    taskDescription: {
        type: String
    },
    // Полное описание задания
    taskInfo: {
        type: String
    },
    taskData: {
        helpInfo: {
            type: Schema.Types.Mixed
        },
        helpData: {
            type: Schema.Types.Mixed
        },
        dataInfo: {
            type: Schema.Types.Mixed
        },
        data: {
            type: Schema.Types.Mixed
        }
    },
    code: {
        type: String
    }
});
module.exports = mongoose.model('Course', Course);