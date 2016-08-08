var Course = require('../models/course');
module.exports = {
    add: function(args, callback) {
        var course = new Course({
            number: args.data.number,
            taskName: args.data.taskName,
            taskDescription: args.data.taskDescription,
            
        });
        course.save(callback);
    },
    list: function(args, callback) {
        //Course.find({}, callback);
        Course.find({}).sort({"number": 1}).exec(callback);
    },
    getTask: function(args, callback) {
        Course.findById(args.taskId).exec(callback);
    },
    update: function(args, callback) {
        var data = args.data || {};
        Course.findByIdAndUpdate(args.taskId, {
            '$set': data
        }, {
            'new': true
        }, function(err, task) {
            callback(err, task);
            task.save();
        });
    }
}