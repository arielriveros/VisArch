import express from 'express';
import GooglePassport from './passport.google';
import GithubPassport from './passport.github';

const router = express.Router();

router.use(GooglePassport.initialize());
router.use(GooglePassport.session());
router.use(GithubPassport.initialize());
router.use(GithubPassport.session());

export default router;