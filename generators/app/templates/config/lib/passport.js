'use strict';

var passport = require('passport'),
    path = require('path'),
    root = path.dirname(require.main.filename),
    User = require(root + '/modules/User/Server/Schemas/user.schema'),
    TMJStrategy = require('tmj-passport'),
    LocalStrategy = require('passport-local');

module.exports = function (app) {
    // TMJ Passport
    passport.use(new TMJStrategy({
        apiToken: app.ENV.BE_TALK_TOKEN,
        url: app.ENV.BE_TALK_API + '/login',
        usernameField: 'username',
        passwordField: 'password'
    }));

    // Local Passport
    passport.use(new LocalStrategy({
        'usernameField': 'email',
        'passwordField': 'password'
    }, function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
};
