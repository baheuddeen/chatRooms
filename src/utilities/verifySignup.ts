import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const schema = Joi.object({
  first_name: Joi.string().required().max(50),
  last_name: Joi.string().required().max(50),
  email: Joi.string().email().min(5).required(),
  password: Joi.string().min(6).required(),
});

export default function verifySignup(req: Request, res: Response, next: NextFunction) {    
  const error = schema.validate(req.body).error;
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
}