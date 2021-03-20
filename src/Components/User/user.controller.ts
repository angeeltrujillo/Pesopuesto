import { RequestHandler } from 'express';
import { IUser } from '../Auth/auth.service';

export const userProfile: RequestHandler = async (req, res, next)  => {
  try {
    const user : IUser = req.user;
    res.status(200).json({
      status: 'Sucess',
      data: {
        user,
      },
    });
  } catch (err) {
    return next(err);
  }
};
