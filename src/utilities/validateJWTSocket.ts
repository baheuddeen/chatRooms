import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import IRequest from '../models/IRequest';
import { UserType } from '../models/db/User';
import { Socket } from 'socket.io';
import { NextHandleFunction } from 'connect';
import { ExtendedError } from 'socket.io/dist/namespace';
import ISocket from '../models/ISocket';
import ChatServer from '../lib/ChatServer';

dotenv.config();

function parseCookies(cookie: string) {
  const cookies = {} as any;
  cookie?.split(';').forEach((item) => {
    const [key, value] = item.split('=');
    cookies[key.trim()] = value;
  });
  return cookies;
}

export default async function validateJWTSocket(socket: ISocket, next: (err?: ExtendedError | undefined) => void) {
  const token = parseCookies(socket.handshake.headers.cookie!)._jwt;  
  try {
    let clientSecret = process.env.JWT_CLIENT_SECRET || 'client-secret';
    let value = jwt.verify(token, clientSecret) as UserType;       
    if (value) {      
      socket.user_data = value;      
      return next();
    }
  } catch (err) {
    return next(new Error('Authentication error'));
  }
}
