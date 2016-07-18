var express = require('express');

module.exports = (app, vocaPackage) => {
    app.get('/',         (req, res) => res.render('home', { version: vocaPackage.version }));
    app.get('/learn',    (req, res) => res.render('learn', { book: 'wmr' }));
    app.get('/exam',     (req, res) => res.render('exam'));
    app.get('/download', (req, res) => res.render('download'));
};
