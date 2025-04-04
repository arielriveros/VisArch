import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/User';

const callbackURL =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.APP_URL}/api/auth/callback/google`
    : 'http://localhost:5000/api/auth/callback/google';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      callbackURL: callbackURL,
      passReqToCallback: true,
    },
    async function (
      req: Express.Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      cb: (error: any, user?: any) => void
    ) {
      try {
        const user = await UserModel.findOne({ providerId: profile.id });
        if (user) return cb(null, user);

        const newUser = new UserModel({
          userName: profile.emails[0].value,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          providerId: profile.id,
          picture: profile.photos[0].value,
        });
        await newUser.save();
        return cb(null, newUser);
      } catch (error) {
        console.error('Error in passport-google', error);
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user: any, cb: (err: any, id?: any) => void) => {
  process.nextTick(() => cb(null, user.id));
});

passport.deserializeUser(async (id: string, cb: (err: any, user?: any) => void) => {
  try {
    const user = await UserModel.findById(id);
    cb(null, user);
  } catch (error) {
    return cb(error);
  }
});

export default passport;