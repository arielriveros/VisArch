const express = require('express');
const passport = require('passport');
const router = express.Router();
const requireAuth = require('../middleware/auth');

const successRedirect = `${process.env.APP_URL}/`;

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/callback/google',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect(successRedirect);
});

// Github
router.get('/github', passport.authenticate('github'));
router.get('/callback/github',
  passport.authenticate('github'),
  (req, res) => {
    res.redirect(successRedirect);
});

// Login
router.get('/login', requireAuth, function(req, res){
  res.status(200).json(req.user);
});

// Logout
router.post('/logout', function(req, res){
  req.logout();
  res.status(200).json({ message: 'Logout' });
});

module.exports = router;