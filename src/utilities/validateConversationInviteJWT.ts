import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import IRequest from '../models/IRequest';
import { UserType } from '../models/db/User';
import { ConversationType } from '../models/db/Conversation';

dotenv.config();

export default async function validateJWT(req:IRequest, res:Response, next:NextFunction) {
  let token = req.query["key"];  
  
  if (!token) {
    return res.status(401).json({msg: 'please add the key in the url query'});
  }  
  try {
    let clientSecret = process.env.JWT_CLIENT_SECRET || 'client-secret';
    let value = jwt.verify(token as string, clientSecret) as ConversationType;       
    if (value) {      
        const conversationId = req.url.split('/').pop()?.split('?')[0];
        console.log(conversationId, value.conversation_id);
        
        if (conversationId == value.conversation_id?.toString()) {
            req.conversationId = conversationId;
            return next();
        }
        throw new Error('unvalid Key');
    }
  } catch (err) {}
  return res.status(401).json({ msg: 'unvalid key ..' });
}
