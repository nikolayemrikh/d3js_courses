var Task = require('../models/task');
var Course = require('../models/course');
module.exports = {
    add: function(args, callback) {
        if (!args.data.courseId) callback(new Error("couresId required"))
        Course.findOne({
            courseId: args.data.courseId
        }).populate("tasks", "taskId").exec(function(err, course) {
            if (err || !course) return callback(err);
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
                    courseId: args.data.courseId,
                    course: course._id,
                    isChallenge: args.data.isChallenge,
                    taskName: args.data.taskName,
                });
                task.save(function(err) {
                    if (err) return callback(err);
                    course.tasks.push(task);
                    course.save(function(err) {
                        if (!err) callback(null, task);
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
        if (!args.courseId) {
            Task.findByIdAndRemove(args.taskId).exec(callback);
        } else {
            Task.findOneAndRemove({courseId: args.courseId, taskId: args.taskId}).exec(callback);
        }
        /*Task.findByIdAndRemove(args.id, function(err, task) {
            console.log(err, task)
            if (err) return callback(err);
            callback(null, task)
        });*/
    }
}