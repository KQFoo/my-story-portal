function isAuthenticated(req, res, next) {
    if (req.oidc.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = {
    isAuthenticated
}; 