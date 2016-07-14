var express = require('express');

module.exports = (app, vocaPackage) => {
    app.get('/',         (req, res) => res.render('index', { version: vocaPackage.version }));
    app.get('/learn',    (req, res) => res.render('learn'));
    app.get('/exam',     (req, res) => res.render('exam'));
    app.get('/download', (req, res) => res.render('download'));
};
