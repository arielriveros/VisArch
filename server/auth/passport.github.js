const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const UserModel = require('../models/User');

const callbackURL = process.env.NODE_ENV === 'production' ? `http://${process.env.APP_URL}/api/auth/callback/github` : 'http://localhost:5000/api/auth/callback/github';

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: callbackURL,
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, cb) {
    try {
      const user = await UserModel.findOne({ providerId: profile.id });
      if (user)
        return cb(null, user);

      const newUser = new UserModel({
        userName: profile.username,
        displayName: profile.displayName,
        email: profile.emails ? profile.emails[0].value : '',
        providerId: profile.id,
        picture: profile.photos[0].value
      });
      await newUser.save();
      return cb(null, newUser);

    } catch (error) {
      console.error('Error in passport-github', error);
      return cb(error);
    }
  }
));
 
passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, user.id));
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await UserModel.findById(id);
    cb(null, user);
  } catch (error) {
    return cb(error);
  }
});

module.exports = passport;