const dependencies = ['learn', 'exam', 'download'];

const common = {
    renderBooks(req, res, next, here, books){
        res.render('pages/books', { here, books });
    },

    renderBook(req, res, next, here, book){
        res.render('pages/book', { here, book });
    },

    isAuthenticated(req, res, next){
        if(req.isAuthenticated()) next();
        else res.redirect('/sign-in');
    },

    flash(key){
        return (req, res, next) => {
            res.locals[key] = req.flash(key);
            if(Array.isArray(res.locals[key])) res.locals[key] = res.locals[key][0];
            next();
        };
    }
};

module.exports = (app) => dependencies.map(d => require(`./pages/${d}`)).forEach(m => m(app, common));
