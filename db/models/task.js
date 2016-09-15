/**
 * Модель задания
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = new Schema({
    taskId: {
        type: Number,
        unique: true
    },
    courseId: {
        type: Number
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
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
    goals: {
        type: String
    },
    jsSolution: {
        type: String
    },
    htmlSolution: {
        type: String
    },
    initialJs: {
        type: String
    },
    jsBlocked: {
        type: Boolean
    },
    initialHtml: {
        type: String
    },
    htmlBlocked: {
        type: Boolean
    },
    initialCss: {
        type: String
    },
    cssBlocked: {
        type: Boolean
    },
    isChallenge: {
        type: Boolean
    },
    // Старые переменные ниже
    code: {
        type: String
    },
    // taskData заменяется на initialJs
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
});
var collectionName = 'tasks';
module.exports = mongoose.model('Task', Task, collectionName);