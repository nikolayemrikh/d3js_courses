var Course = require('../models/course');
module.exports = {
    add: function(args, callback) {
        var course = new Course({
            name: args.data.name
        });
        course.save(callback);
    },
    list: function(args, callback) {
        Course.find({}).populate('tasks').sort({
            "number": 1
        }).exec(callback);
        /*Course.find({}).sort({
            "number": 1
        }).exec(callback);*/
    },
    getCourse: function(args, callback) {
        Course.findById(args.taskId).populate({
            path: "tasks",
            options: {
                sort: {
                    "number": 1
                }
            }
        }).exec(callback);
    },
    update: function(args, callback) {
        var data = args.data || {};
        Course.findByIdAndUpdate(args.taskId, {
            '$set': data
        }, {
            'new': true
        }, function(err, course) {
            callback(err, course);
            course.save();
        });
    }
}