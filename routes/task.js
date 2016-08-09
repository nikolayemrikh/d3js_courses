var express = require('express');
var router = express.Router();
var task = require('../db/dao/task');
// List all task in course
router.get('/', function(req, res) {
    var args = {};
    task.list(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Get task by id
router.get('/:taskId', function(req, res) {
   var args = {
       taskId: req.params.taskId
   };
   task.getTask(args, function(err, data) {
       if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
   });
});
// Create new task
router.post('/', function(req, res) {
    var args = {
        data: req.body
    };
    task.add(args, function(err, data) {
        if (!err && data) {
            res.status(200).end();
        }
        else {
            res.status(400).end();
        }
    });
});
// Update task
router.put('/:taskId', function(req, res) {
    var args = {
        taskId: req.params.taskId,
        data: req.body
    };
    task.update(args, function(err, data) {
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