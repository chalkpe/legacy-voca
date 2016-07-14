var express = require('express');

module.exports = app => {
    app.get('/',         (req, res) => res.render('index'));
    app.get('/learn',    (req, res) => res.render('learn'));
    app.get('/exam',     (req, res) => res.render('exam'));
    app.get('/download', (req, res) => res.render('download'));
};
