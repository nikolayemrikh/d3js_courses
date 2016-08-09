var express = require('express');
var router = express.Router();
var course = require('../db/dao/course');
// List all course in course
router.get('/', function(req, res) {
    var args = {};
    course.list(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Get course by id
router.get('/:taskId', function(req, res) {
   var args = {
       taskId: req.params.taskId
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
router.post('/', function(req, res) {
    var args = {
        data: req.body
    };
    course.add(args, function(err, data) {
        if (!err && data) {
            res.status(200).end();
        }
        else {
            res.status(400).end();
        }
    });
});
// Update course
router.put('/:taskId', function(req, res) {
    var args = {
        taskId: req.params.taskId,
        data: req.body
    };
    course.update(args, function(err, data) {
        if (!err && data) {
            /*req.login(data, function(error) {
                if (error) res.status(400).end();
                else res.json(data);
            });*/
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
module.exports = router;