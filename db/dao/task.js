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
        Task.findOne(args.number).exec(callback);
    },
    update: function(args, callback) {
        var data = args.data || {};
        Task.findOneAndUpdate(args.number, {
            '$set': data
        }, {
            'new': true
        }, function(err, task) {
            callback(err, task);
            task.save();
        });
    }
}