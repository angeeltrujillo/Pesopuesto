import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import { undefinedRoute, errorHandler } from './Helpers';
import authRoutes from '../Components/Auth/auth.routes';
import userRoutes from '../Components/User/user.routes';
import accountRoutes from '../Components/Account/account.routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests.',
}));
app.use(passport.initialize());
// Route declaration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/account', accountRoutes);

app.use('*', undefinedRoute);
app.use(errorHandler);

export default app;
