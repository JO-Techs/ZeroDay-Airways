function isLoggedIn(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  return next();
}

function isAdmin(req, res, next) {
  // VULN-09: role is read from session without server-side recheck.
  // INTENTIONALLY INSECURE — see VULN-09.
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  return res.status(403).send('Forbidden');
}

module.exports = { isLoggedIn, isAdmin };
