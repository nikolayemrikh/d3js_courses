var Course = require('../models/course');
var Task = require("./task");
module.exports = {
    add: function(args, callback) {
        var course = new Course({
            name: args.data.name,
            number: args.data.number,
            //Работают кастомные id
            //_id: "coursetest"
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
        Course.find({}).populate('tasks', 'taskDescription taskName number').sort({
            "number": 1
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
            select: "taskDescription taskName taskId",
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
        Course.findByIdAndRemove(args.id, function(err, course) {
            if (err) return callback(err);
            callback(null, course)
        });
    },
    /*update: function(args, callback) {
        var data = args.data || {};
        delete data._id;
        //delete data.tasks;
        Course.findOne({
            number: args.number
        }).exec(function(err, course) {
            if (err || !course) return callback(err);
            // var task = new Task({

            // });
            
            Task.findOne()
            
            task.save(function(err) {
                if (err) return callback(err);
                course.tasks.push(task);
            });
        });*/
        /*
        console.log(data)
        Course.findOneAndUpdate({number: data.number}, {
            //'$set': data
            $push: {"tasks": data.tasks[3]}
        }, {
            'new': true
        }, function(err, course) {
            callback(err, course);
            //course.save();
        });

    }*/
}