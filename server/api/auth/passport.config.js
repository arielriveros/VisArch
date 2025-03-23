const express = require('express');
const GooglePassport = require('./passport.google');
const GithubPassport = require('./passport.github');

const router = express.Router();

router.use(GooglePassport.initialize());
router.use(GooglePassport.session());
router.use(GithubPassport.initialize());
router.use(GithubPassport.session());

exports.router = router;