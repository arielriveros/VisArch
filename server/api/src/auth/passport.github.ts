import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import UserModel from '../models/User';

const callbackURL =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.APP_URL}/api/auth/callback/github`
    : 'http://localhost:5000/api/auth/callback/github';

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
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
          userName: profile.username,
          displayName: profile.displayName,
          email: profile.emails ? profile.emails[0].value : '',
          providerId: profile.id,
          picture: profile.photos[0].value,
        });
        await newUser.save();
        return cb(null, newUser);
      } catch (error) {
        console.error('Error in passport-github', error);
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