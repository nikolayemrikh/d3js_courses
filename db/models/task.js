/**
 * Модель задания
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = new Schema({
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
var collectionName = 'tasks';
module.exports = mongoose.model('Task', Task, collectionName);