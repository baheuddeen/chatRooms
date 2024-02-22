import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string().email().min(5).required(), 
  password: Joi.string().min(6).required(),
  user_name: Joi.string().required(),
  public_key: Joi.string().required(),
});

export default function verifySignup(req: Request, res: Response, next: NextFunction) {
  const error = schema.validate(req.body).error;
  if (error) {    
    return res.status(400).send('JOI Error' + error.details[0].message);
  }
  next();
}