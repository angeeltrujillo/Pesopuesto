import joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRepository } from "typeorm";
import { User } from '../User/user.entity';

export interface IUser {
  id?: number,
  firstName?: string,
  lastName?: string,
  userName?: string,
  provider?: string,
  photoUrl?: string,
  email?: string,
  password?: any,
  _id? : string,
  createdAt?: Date
}

export const singUpValidator = async (userDetails: IUser) => {
  const schema = joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    userName: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().required(),
    provider: joi.string(),
    photoUrl: joi.string(),
  });
  const validUser: IUser = await schema.validateAsync(userDetails);
  return validUser;
};

export const hashPassword = async (password: string) => {
  const SaltRounds: number = 10;
  const hashedPassword: string = await bcrypt.hash(password, SaltRounds);
  return hashedPassword;
};

export const tokenForgotPassword = (userDetail: IUser) => {
  const { id, password, createdAt } = userDetail;
  const secret = `${password}-${createdAt}`;
  const tokenForgotPassword: string = jwt.sign({id}, secret, {expiresIn: 3600});
  return tokenForgotPassword;
}

export const createUser = async (userDetail: IUser) => {
  const result = getRepository(User).create(userDetail);
  const user = await getRepository(User).save(result);
  return user;
};

export const updateUser = (user: IUser) => {
  const updatedUser = getRepository(User).save(user)
  return updatedUser;
}

export const createToken = (id: number) => jwt.sign({
  id,
}, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

export const logInValidator = async (userCredentials: IUser) => {
  const schema = joi.object().keys({
    email: joi.string().required().email(),
    password: joi.string().required(),
  });
  const validCredentials: IUser = await schema.validateAsync(userCredentials);
  return validCredentials;
};

export const findUserByEmail = async (email: string) => {
  const user : IUser = await getRepository(User).findOne({ email });
  return user;
};

export const findUserById = async (id: number) => {
  const user : IUser = await getRepository(User).findOne({ id });
  return user;
};


export const checkPassword = async (user : IUser, password : string) => {
  const comparedPassword : boolean = await bcrypt.compare(password, user.password);
  return comparedPassword;
};

export const getPasswordResetUrl = (userId: number, token: string) => {
  const url = `${process.env.BASE_URL}/api/v1/auth/forgotPassword/${userId}/${token}`;
  return url;
}

export const verifyToken = (user: IUser, token: string) => {
  const secret: string = `${user.password}-${user.createdAt}`;
    const payload = jwt.verify(token, secret);
    return payload;
}
