import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { render } from '@react-email/render';
import MaloloWelcomeEmail from '../email/templates/welcome';
import { Platform, RoleEnum } from '../global';

const prisma = new PrismaClient();
const User = prisma.user;

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    callbackURL: process.env.CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done: VerifyCallback) => {
    const email = profile._json.email;
    const sub = profile._json.sub;
    try {
      if (email && !(await User.findFirst({ where: { email } }))) {
        await User.create({
          data: {
            email,
            firstName: profile._json.given_name,
            lastName: profile._json.family_name,
            avatar: profile._json.picture,
            roles: {
              create: {
                role: { connect: { name: RoleEnum.USER } },
              },
            },
            platform: Platform.GOOGLE,
            isVerified: true,
          },
        });
        const emailHtml = render(
          MaloloWelcomeEmail({ userFirstName: profile._json.given_name || '' }),
        );
        // await sendEmail(emailHtml, email, 'Your Adventure Begins with Malolo!');
      }
      const user = await User.findFirst({
        where: { email },
        include: {
          roles: {
            include: { role: true },
          },
        },
      });
      done(null, { id: user?.id, email, roles: user?.roles });
    } catch (error: any) {
      done(error);
    }
  },
);

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: process.env.SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (payload, done: VerifyCallback) => {
    return done(null, payload.user);
  },
);

passport.use('google', googleStrategy);
passport.use('jwt', jwtStrategy);

export default passport;
