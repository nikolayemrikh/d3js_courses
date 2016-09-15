var Task = require('../models/task');
var Course = require('../models/course');
module.exports = {
    add: function(args, callback) {
        if (!args.courseId) callback(new Error("courseId required"))
        Course.findOne({
            courseId: args.courseId
        }).populate("tasks", "taskId").exec(function(err, course) {
            if (err || !course) return callback(err);
            for (var i = 0; i < course.tasks.length; i++) {
                var task = course.tasks[i];
                if (args.data.number == task.taskId) callback(new Error("Задание с таким номером уже существует в курсе"));
            }

            course.save(function(err) {
                if (err) return callback(err);
                var task = new Task({
                    taskId: args.data.number,
                    courseId: args.courseId,
                    course: course._id,
                    isChallenge: args.data.isChallenge,
                    taskName: args.data.taskName,
                    taskDescription: args.data.taskDescription
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
            }).populate("tasks").sort({"taskId": 1}).exec(function(err, course) {
                console.log(course)
                if (err) return callback(err);
                callback(null, course.tasks)
            });
        }
        else {
            Task.find({}).sort({
                "taskId": 1
            }).exec(callback);
        }
    },
    getTask: function(args, callback) {
        if (!args.courseId) {
            Task.findById(args.taskId).exec(callback);
        }
        else {
            Task.findOne({
                courseId: args.courseId,
                taskId: args.taskId
            }).exec(callback);
        }
    },
    update: function(args, callback) {
        var data = args.data || {};
        /*Course.findOne({
            courseId: args.data.courseId
        }).populate("tasks", "taskId").exec(function(err, course) {
            if (err) return callback(err);
            var taskIds = course.tasks.map(function(task) {
                return task.taskId;
            })
            if (taskIds.indexOf(args.data.taskId) != -1) return callback(new Error("Задание с таким номером уже существует"));
        });
        Task.findOneAndUpdate({
            _id: args._id
        }, {
            '$set': data
        }, {
            'new': true
        }, function(err, task) {
            if (err) return callback(err);
            callback(null, task);
            //task.save();
        });*/
        Task.findById(args._id, function(err, task) {
            if (err) return callback(err);
            Course.findOne({
                courseId: args.data.courseId
            }).populate("tasks", "taskId").exec(function(err, course) {
                if (err) return callback(err);
                var taskIds = course.tasks.map(function(task) {
                    return task.taskId;
                });
                if (task.taskId != args.data.taskId && taskIds.indexOf(args.data.taskId) != -1) return callback(new Error("Задание с таким номером уже существует в курсе"));
                Task.findOneAndUpdate({
                    _id: args._id
                }, {
                    '$set': data
                }, {
                    'new': true
                }, function(err, task) {
                    if (err) return callback(err);
                    callback(null, task);
                    //task.save();
                });
            });
        });
    },
    delete: function(args, callback) {
        if (!args.courseId) callback(new Error("courseId required"));
        Course.findOne({
            courseId: args.courseId
        }).populate("tasks", "taskId").exec(function(err, course) {
            if (err || !course) return callback(err);
            course.save(function(err) {
                if (err) return callback(err);
                for (var i = 0; i < course.tasks.length; i++) {
                    if (course.tasks[i].taskId == args.taskId) course.tasks.splice(i, 1);
                }
                Task.findOneAndRemove({
                    courseId: args.courseId,
                    taskId: args.taskId
                }).exec(function(err, task) {
                    if (err) return callback(err);
                    course.save(function(err) {
                        if (err) return callback(err);
                        callback(null, task);
                    });
                });
            });
        });
    }
}