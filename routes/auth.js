const profile = require('./pages/profile');

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
    req.checkBody('grade', 'Grade must be an integer').isInt();
    req.checkBody('grade', 'Grade must be exactly 1 character').isLength({ min: 1, max: 1 });
    req.checkBody('class', 'Class must be an integer').isInt();
    req.checkBody('class', 'Class must be exactly 1 character').isLength({ min: 1, max: 1 });
    req.checkBody('number', 'Number must be an integer').isInt();
    req.checkBody('number', 'Number must be at least 1 character').isLength({ min: 1 });
    req.checkBody('number', 'Number cannot be longer than 2 characters').isLength({ max: 2 });

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

    req.flash('message', errors.map(e => e.msg));
    res.redirect('/sign-in');
}

module.exports = (app, passport) => {
    app.use((req, res, next) => {
        res.locals.user = req.user;
        res.locals.title = app.get('title');
        next();
    });

    app.get('/', flashMessage, profile, (req, res) => res.render('pages/home'));
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
