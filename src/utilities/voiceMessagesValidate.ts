import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import IRequest from '../models/IRequest';
import { UserType } from '../models/db/User';

dotenv.config();

export default async function voiceMessageValidate(req:IRequest, res:Response, next:NextFunction) {
  if (req.headers.referer) {
    return next();
  } else {
    return res.status(401).json({ msg: 'please signin first ..' });
  }
//   let token = req.query["jwt"];
//   if (!token) {
//     token = req.cookies._jwt;
//   }  
//   try {
//     let clientSecret = process.env.JWT_CLIENT_SECRET || 'client-secret';
//     let value = jwt.verify(token as string, clientSecret) as UserType;       
//     if (value) {      
//       req.user_data = value;      
//       return next();
//     }
//   } catch (err) {}
//   return res.status(401).json({ msg: 'please signin first ..' });
}
