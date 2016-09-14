var Task = require('../models/task');
var Course = require('../models/course');
module.exports = {
    add: function(args, callback) {
        if (!args.courseId) callback(new Error("courseId required"))
        Course.findOne({
            courseId: args.courseId
        }).populate("tasks", "taskId").exec(function(err, course) {
            if (err || !course) return callback(err);
            console.log(course)
            var clientNumber;
            if (args.data.number) {
                clientNumber = Number.parseInt(args.data.number);
            }
            var maxNumber;
            if (course.tasks[0]) {
                maxNumber = course.tasks[0].taskId;
                for (var i = 1; i < course.tasks.length; i++) {
                    var task = course.tasks[i];
                    if (task.taskId == clientNumber) clientNumber = null;
                    if (task.taskId > maxNumber) maxNumber = task.taskId;
                }
            }
            else {
                maxNumber = 1;
            }

            course.save(function(err) {
                if (err) return callback(err);
                var task = new Task({
                    taskId: clientNumber ? clientNumber : maxNumber + 1,
                    courseId: args.courseId,
                    course: course._id,
                    isChallenge: args.data.isChallenge,
                    taskName: args.data.taskName,
                });
                console.log(task)
                task.save(function(err, task) {
                    if (err) return callback(err);
                    course.tasks.push(task);
                    course.save(function(err) {
                        if (err) return callback(err);
                        callback(null, task);
                    });
                });
            });
        });
    },
    list: function(args, callback) {
        if (args.courseId) {
            Course.findOne({
                courseId: args.courseId
            }).populate("tasks").exec(function(err, course) {
                console.log(course)
                if (err) return callback(err);
                callback(null, course.tasks)
            });
        }
        else {
            Task.find({}).sort({
                "number": 1
            }).exec(callback);
        }
    },
    getTask: function(args, callback) {
        if (!args.courseId) {
            Task.findById(args.taskId).exec(callback);
        } else {
            Task.findOne({courseId: args.courseId, taskId: args.taskId}).exec(callback);
        }
    },
    update: function(args, callback) {
        var data = args.data || {};
        Task.findOneAndUpdate({
            number: args.number
        }, {
            '$set': data
        }, {
            'new': true
        }, function(err, task) {
            callback(err, task);
            task.save();
        });
    },
    delete: function(args, callback) {
        if (!args.courseId) callback(new Error("courseId required"));
        Course.findOne({
            courseId: args.courseId
        }).exec(function(err, course) {
            if (err || !course) return callback(err);
            course.save(function(err) {
                if (err) return callback(err);
                var pos = course.tasks.indexOf(args.taskId);
                Task.findOneAndRemove({courseId: args.courseId, taskId: args.taskId}).exec(function(err) {
                    if (err) return callback(err);
                    course.tasks.splice(pos, 1);
                    course.save(callback);
                });
            });
        });
    }
}