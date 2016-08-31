const vocaPackage = require('../package.json');

function isAuthenticated(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/');
    next();
}

function flashMessage(req, res, next){
    res.locals.message = req.flash('message');
    next();
}

function validateSignUp(req, res, next){
    req.checkBody('email', 'Email must be a valid e-mail').isEmail();
    req.checkBody('password', 'Password must be at least 8 characters').isLength({ min: 8 });
    req.checkBody('confirm', 'Confirm password must match password field').equals(req.body.password);
    req.checkBody('name', 'Name must be at least 2 characters').isLength({ min: 2 });
    req.checkBody('studentId', 'Student ID must be an integer').isInt();
    req.checkBody('studentId', 'Student ID must be at least 4 characters').isLength({ min: 4 });
    req.checkBody('studentId', 'Student ID cannot be longer than 5 characters').isLength({ max: 5 });

    let errors = req.validationErrors();
    if(!errors) return next();

    req.flash('message', errors.map(e => e.msg));
    res.redirect('/');
}

function validateSignIn(req, res, next){
    req.checkBody('email', 'Email must be a valid e-mail').isEmail();
    req.checkBody('password', 'Password must be at least 8 characters').isLength({ min: 8 });

    let errors = req.validationErrors();
    if(!errors) return next();

    req.flash('messages', errors);
    res.redirect('/');
}

module.exports = (app, passport) => {
    app.use((req, res, next) => {
        res.locals.user = req.user;
        res.locals.title = app.get('title');
        next();
    });

    app.get('/', flashMessage, (req, res) => res.render('pages/home', { here: '/', vocaPackage }));
    app.post('/', validateSignUp, passport.authenticate('sign-up', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/sign-in', flashMessage, (req, res) => res.render('pages/sign-in', { here: '/sign-in' }));
    app.post('/sign-in', validateSignIn, passport.authenticate('sign-in', {
        successRedirect: '/',
        failureRedirect: '/sign-in',
        failureFlash: true
    }));

    app.get('/sign-out', isAuthenticated, (req, res) => {
        req.logout();
        res.redirect('/');
    });
};
