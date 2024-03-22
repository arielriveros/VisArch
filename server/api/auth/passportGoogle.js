const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/User');

const callbackURL = process.env.NODE_ENV === 'production' ? `${process.env.APP_URL}/api/auth/callback/google` : 'http://localhost:5000/api/auth/callback/google';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: callbackURL,
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, cb) {
    try {
      const user = await UserModel.findOne({ providerId: profile.id });
      if (user)
        return cb(null, user);

      const newUser = new UserModel({
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        providerId: profile.id,
        picture: profile.photos[0].value
      });
      await newUser.save();
      return cb(null, newUser);

    } catch (error) {
      console.error('Error in passport-google', error);
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