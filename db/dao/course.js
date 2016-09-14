var Course = require('../models/course');
var Task = require("../models/task");
module.exports = {
    add: function(args, callback) {
        var course = new Course({
            name: args.data.name,
            description: args.data.description,
            courseId: args.data.number,
            tasks: args.data.tasks
        });
        course.save(function(err) {
            if (err) return callback(err);
            callback(null, course);
        });
        //Проверим, есть ли курс с таким номером
        /*Course.findOne({
            number: args.data.number
        }, function(err, course) {
            console.log(err, course);
        });*/
    },
    list: function(args, callback) {
        //Забираем из модели Task только нужные для #start поля
        Course.find({}).populate('tasks', 'taskDescription taskName taskId').sort({
            "courseId": 1
        }).exec(callback);
        /*Course.find({}).sort({
            "number": 1
        }).exec(callback);*/
    },
    getCourse: function(args, callback) {
        Course.findOne({
            courseId: args.courseId
        }).populate({
            path: "tasks",
            select: "taskDescription taskName taskId courseId",
            options: {
                sort: {
                    "taskId": 1
                }
            }
        }).exec(function(err, course) {
            if (err) return callback(err);
            callback(null, course)
        });
    },
    delete: function(args, callback) {
        Course.findOneAndRemove({
            courseId: args.courseId
        }, function(err, course) {
            if (err) return callback(err);
            course.tasks.forEach(function(_id, index, tasks) {
                Task.findByIdAndRemove(_id).exec(function(err) {
                    if (err) return callback(err);
                    if (index == tasks.length - 1) callback(null, course);
                });
            });
        });
    },
    update: function(args, callback) {
        var data = args.data || {};
        Course.findOneAndUpdate({
            courseId: args.courseId
        }, {
            '$set': data
        }, {
            'new': true
        });
    }
}