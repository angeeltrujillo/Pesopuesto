import express from 'express';
import passport from 'passport';
import { userLogin, userSignUp, OAuthHandler, userForgotPassword, userSetNewPassword} from './auth.controller';

const router = express.Router();

router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.post('/forgotPassword', userForgotPassword);
router.post('/forgotPassword/:id/:token', userSetNewPassword);
router.get('/google', passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), OAuthHandler);
router.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), OAuthHandler);

export default router;
