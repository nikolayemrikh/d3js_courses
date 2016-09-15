var express = require('express');
var router = express.Router();
var course = require('../db/dao/course');
var taskRouter = require('./task');
router.use('/:courseId/task', taskRouter);
// List all course in course
router.get('/', function(req, res, next) {
    var args = {};
    course.list(args, function(err, data) {
        if (!err && data) {
            /*data = data.map(function(course) {
                course._id = course.number;
                return course;
            });*/
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Get course by number
router.get('/:courseId', function(req, res) {
    var args = {
        courseId: req.params.courseId
    };
    course.getCourse(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Create new course
router.post('/', function(req, res, next) {
    var args = {
        data: req.body
    };
    course.add(args, function(err, data) {
        if (!err && data) {
            //res.status(200).end();
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Update course
router.put('/:_id', function(req, res, next) {
    var args = {
        _id: req.params._id,
        data: req.body
    };
    course.update(args, function(err, data) {
        if (!err && data) {
            //data._id = data.number;
            res.json(data);
        }
        else {
            //res.status(400).end();
            res.status(400).send(err.message);
        }
    });
});
// Remove course
router.delete('/:courseId', function(req, res, next) {
    console.log('tyt')
    var args = {
       courseId: req.params.courseId
   };
   course.delete(args, function(err, data) {
       if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
   });
});
module.exports = router;