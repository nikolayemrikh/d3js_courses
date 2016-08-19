var Task = require('../models/task');
var Course = require('../models/course');
module.exports = {
    add: function(args, callback) {
        //task.save(callback);
        Course.findById(args.data.courseId).exec(function(err, course) {
            if (err || !course) return callback(err);
            course.save(function(err) {
                if (err) return callback(err);
                var task = new Task({
                    courseId: args.data.courseId,
                    isChallenge: args.data.isChallenge,
                    number: args.data.number,
                    taskName: args.data.taskName,
                });
                task.save(function(err) {
                    if (err) return callback(err);
                    course.tasks.push(task);
                    course.save(callback);
                });
            });
        });
    },
    list: function(args, callback) {
        //Task.find({}, callback);
        Task.find({}).sort({
            "number": 1
        }).exec(callback);
    },
    getTask: function(args, callback) {
        Task.findOne({
            number: args.number
        }).exec(callback);
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
    }
}