var express = require('express');
var router = express.Router();
var config = require('nconf');
var storage = require('../db/dao/storage');
var multer = require('multer');
var fs = require('fs');
var urlify = require('urlify').create();
var upload = multer({
    dest: config.get('uploads:tmpdir'),
    limits: {
        fileSize: config.get("uploads:limit") * 1024 * 1024, // MB
        files: 10
    },
    onFileSizeLimit: function(file) {
        fs.unlink('./' + file.path); // delete the partially written file
        file.failed = true;
    }
}).array('files');

// Upload attach
router.post('/', upload, function(req, res, next) {
    /*var file = req.file;
    if (!file) return res.status(400).end();
    var fname = file.originalname;
    var name = fname.slice(0, fname.lastIndexOf('.'));
    var ext = fname.slice(fname.lastIndexOf('.') + 1);
    file.originalname = urlify(name) + '.' + urlify(ext);
    // если multer не может писать в dest, то отправляет файл в виде буфера
    if (file.buffer) res.status(500).end();*/
    //else res.json(file);
    
    var files = req.files;
    if (!files) return res.status(400).end();
    
    storage.upload(files, function(attach) {
        //res.json(file);
        res.send(attach);
    });
});

// Download attach
router.get('/:fileId', function(req, res, next) {
    var fileId = req.params.fileId;
    storage.download(fileId, function(data) {
        if (!data) return res.status(404).end();
        res.header('Content-Disposition', 'attachment; filename="' + data.filename + '"');
        return res;
    });
});

module.exports = router;