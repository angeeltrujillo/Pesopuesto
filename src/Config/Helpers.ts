import { RequestHandler, ErrorRequestHandler } from 'express';
import { nextTick } from 'process';
import { getRepository } from "typeorm";
import { User } from '../Components/User/user.entity';

// Global App Error
export class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(statusCode : number, status : string, message : string) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
  }
}
// Undefined route error
export const undefinedRoute: RequestHandler = (req, res, next) => {
  const error = new AppError(404, 'No encontrado', 'Ruta indefinida');
  next(error);
};
// Error Handler

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
  });
};

export const OAuthUserCreation = async (profile: any) => {
  const currentUser = await getRepository(User).findOne({ providerId: profile.id })
  if (currentUser) {
    return currentUser;
  }
  const result = getRepository(User).create({
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    provider: profile.provider,
    providerId: profile.id,
    email: profile.emails[0]?.value,
    userPictureUrl: profile.photos[0]?.value,
  });
  const newUser = await getRepository(User).save(result)
  return newUser;

};
