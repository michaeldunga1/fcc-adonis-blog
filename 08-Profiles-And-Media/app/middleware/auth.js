const User = require('../models/user');

async function loadUser(req, res, next) {
  if (req.session?.userId) {
    req.user = await User.find(req.session.userId);
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

module.exports = { loadUser, requireAuth };
