module.exports = (app, passport) => {
    require('./auth')(app, passport);
    require('./pages')(app);

    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404; next(err);
    });

    /* eslint-disable no-unused-vars */
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            status: err.status,
            stack: app.get('env') === 'development' && err.stack
        });
    });
};
