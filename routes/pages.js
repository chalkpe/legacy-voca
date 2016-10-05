const common = {
    renderBooks(req, res, next, here, books){
        res.render('pages/books', { here, books });
    },

    renderBook(req, res, next, here, book){
        res.render('pages/book', { here, book });
    },

    isAuthenticated(req, res, next){
        if(!req.isAuthenticated()) return res.redirect('/sign-in');
        next();
    }
};

module.exports = (app) => ['exam', 'learn', 'download'].map(m => require(`./pages/${m}`)).forEach(m => m(app, common));
