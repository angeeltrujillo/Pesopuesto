import { RequestHandler } from 'express';
import passport from 'passport';
import {
  singUpValidator,
  IUser,
  hashPassword,
  createUser,
  updateUser,
  createToken,
  logInValidator,
  findUserByEmail,
  checkPassword,
  tokenForgotPassword,
  getPasswordResetUrl,
  findUserById,
  verifyToken,
} from './auth.service';
import { AppError } from '../../Config/Helpers';
import { ForgotPasswordEmail } from '../../Config/Mail';
// eslint-disable-next-line no-unused-vars
const passportConfig = require('../../Config/Passport');

export const userSignUp: RequestHandler = async (req, res, next) => {
  try {
    const userDetails: IUser = req.body;
    const {
      firstName, lastName, userName, email, password, provider = 'local',
    } = await singUpValidator(userDetails);
    const hashedPassword : string = await hashPassword(password);
    const user = await createUser({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      provider,
    });
    const token = createToken(user.id);
    user.password = undefined;
    return res.status(201).json({
      status: 'Success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      return next(new AppError(400, 'Petición incorrecta', error.message));
    }
    if (error.name === 'QueryFailedError' && error.code === '23505') {
      return next(new AppError(400, 'Petición incorrecta', 'Ya existe el correo electrónico'));
    }
    next(error);
  }
};

export const userLogin: RequestHandler = async (req, res, next) => {
  try {
    const userCredentials: IUser = req.body;
    const { email, password } = await logInValidator(userCredentials);
    const user : IUser = await findUserByEmail(email);
    if (user == null) {
      return next(new AppError(401, 'No autorizado', 'Usuario inexistente o contraseña incorrecta.'));
    }
    const correctPassword: boolean = await checkPassword(user, password);
    if (correctPassword === false) {
      return next(new AppError(401, 'No autorizado', 'Usuario inexistente o contraseña incorrecta.'));
    }
    const token = createToken(user.id);
    user.password = undefined;
    return res.status(200).json({
      status: 'Sucess',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new AppError(400, 'Petición incorrecta', error.message));
    }
    next(error);
  }
};

export const userAuth: RequestHandler = async (req, res, next) => {
  try {
    passport.authenticate('jwt', (err, user) => {
      if (err) {
        return next(new AppError(401, 'No autorizado', 'No ha iniciado sesión. Inicie sesión para continuar.'));
      }
      if (!user) {
        return next(new AppError(401, 'No autorizado', 'No ha iniciado sesión. Inicie sesión para continuar.'));
      }
      user.password = undefined;
      req.logIn(user, { session: false }, (err) => next(err));
    })(req, res, next);

  } catch (error) {
    next(error);
  }
};

export const OAuthHandler: RequestHandler = async (req, res, next) => {
  try {
    const user : IUser = req.user;
    const token = createToken(user.id);
    user.password = undefined;
    res.status(200).json({
      status: 'Sucess',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    if (error.name === 'QueryFailedError' && error.code === '23505') {
      return next(new AppError(400, 'Petición incorrecta', 'Ya existe el correo electrónico'));
    }
    next(error);
  }
};

export const userForgotPassword: RequestHandler = async (req, res, next) => {
  try {
    let email: string = req.body.email;
    const user: IUser = await findUserByEmail(email);
    if (user) {
      const token: string = tokenForgotPassword(user);
      const url: string = getPasswordResetUrl(user.id, token);
      await ForgotPasswordEmail(user.email, url);
      return res.status(202).json({
        status: 'Sucess',
        message: "Correo electrónico programado para envío"
      }); 
    } else {
      return next(new AppError(401, 'No autorizado', 'Usuario inexistente'));
    }
  } catch (error) {
    next(error);
  }
};

export const userSetNewPassword: RequestHandler = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { newPassword } = req.body;
    const user: IUser = await findUserById(parseInt(id));
    const payload = verifyToken(user, token);
      if ((<any>payload).id == user.id) {
        const hashedPassword : string = await hashPassword(newPassword);
        user.password = hashedPassword;
        const updatedUser = await updateUser(user)
        return res.status(204).json({
          status: 'Sucess',
          data: {
            updatedUser
          }
        }); 
    }
  } catch (error) {
    next(error)
  }
}