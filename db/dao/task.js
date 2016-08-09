var Task = require('../models/task');
module.exports = {
    add: function(args, callback) {
        var task = new Task({
            number: args.data.number,
            taskName: args.data.taskName,
            taskDescription: args.data.taskDescription,
            
        });
        task.save(callback);
    },
    list: function(args, callback) {
        //Task.find({}, callback);
        Task.find({}).sort({"number": 1}).exec(callback);
    },
    getTask: function(args, callback) {
        Task.findById(args.taskId).exec(callback);
    },
    update: function(args, callback) {
        var data = args.data || {};
        Task.findByIdAndUpdate(args.taskId, {
            '$set': data
        }, {
            'new': true
        }, function(err, task) {
            callback(err, task);
            task.save();
        });
    }
}