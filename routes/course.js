var express = require('express');
var router = express.Router();
var course = require('../db/dao/course');
// List all course in course
router.get('/', function(req, res) {
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
router.get('/:number', function(req, res) {
    var args = {
        number: req.params.number
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
router.put('/:number', function(req, res) {
    var args = {
        number: req.params.number,
        data: req.body
    };
    course.update(args, function(err, data) {
        if (!err && data) {
            //data._id = data.number;
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
module.exports = router;