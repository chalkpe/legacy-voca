const mongoose = require('mongoose');
const User = require('../models/User');

const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;

const config = { usernameField: 'email', passwordField: 'password', passReqToCallback: true };

module.exports = () => {
    passport.serializeUser((user, done) => done(null, user.email));
    passport.deserializeUser((email, done) => User.findOne({ email }, (err, user) => done(err, user)));

    passport.use('sign-up', new LocalStrategy(config, (req, email, password, done) => process.nextTick(() => User.findOne({ email }, (err, user) => {
        if(err) return done(err);
        if(user) return done(null, false, req.flash('message', 'That email is already taken.'));

        var newUser = new User({
            email, name: req.body.name,
            studentId: req.body.studentId
        });

        newUser.password = newUser.hash(password);
        newUser.save(err => done(err, newUser));
    }))));

    passport.use('sign-in', new LocalStrategy(config, (req, email, password, done) => process.nextTick(() => User.findOne({ email }, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false, req.flash('message', 'No user found.'));
        if(!user.check(password)) return done(null, false, req.flash('message', 'Wrong password.'));

        return done(null, user);
    }))));
};
