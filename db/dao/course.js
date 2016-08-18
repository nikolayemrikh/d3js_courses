var Course = require('../models/course');
module.exports = {
    add: function(args, callback) {
        var course = new Course({
            name: args.data.name
        });
        course.save(callback);
    },
    list: function(args, callback) {
        //Забираем из модели Task только нужные для #start поля
        Course.find({}).populate('tasks', 'taskDescription taskName number').sort({
            "number": 1
        }).exec(callback);
        /*Course.find({}).sort({
            "number": 1
        }).exec(callback);*/
    },
    getCourse: function(args, callback) {
        //Course.findById(args.taskId).populate({
        Course.findOne({number: args.number}).populate({
            path: "tasks",
            select: "taskDescription taskName number",
            options: {
                sort: {
                    "number": 1
                }
            }
        }).exec(callback);
    },
    update: function(args, callback) {
        var data = args.data || {};
        //Course.findByIdAndUpdate(args.taskId, {
        Course.findOneAndUpdate({number: args.number}, {
            '$set': data
        }, {
            'new': true
        }, function(err, course) {
            callback(err, course);
            course.save();
        });
    }
}