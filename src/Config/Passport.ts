import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportGoogle from 'passport-google-oauth';
import passportFacebook from 'passport-facebook';
import dotenv from 'dotenv';
import { OAuthUserCreation } from './Helpers';
import { getRepository } from "typeorm";
import { User } from '../Components/User/user.entity';

if (process.env.NODE_ENV !== 'production') dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const GoogleStrategy = passportGoogle.OAuth2Strategy;
const FacebookStrategy = passportFacebook.Strategy;

const { ExtractJwt } = passportJwt;

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}, (async (jwtPayload, done) => {
    try {
      const user = await getRepository(User).findOne(jwtPayload.id);
      if (user) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (error) {
      return done(error, false)
    }
  }
)));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
}, (async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await OAuthUserCreation(profile);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
})));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/v1/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'name', 'photos', 'emails'],
}, (async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await OAuthUserCreation(profile);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
})));
