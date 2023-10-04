import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import auth from './api/auth/auth';
import user from './handlers/User';
import cookies from 'cookie-parser';
import validateJWT from '../utilities/validateJWT';

var router = express.Router();

router.use(bodyParser.json());
router.use(cookies());

// users
router.use('/users', user);

// Authenication
router.use('/auth', validateJWT, auth);

//protected get
router.get('/protected', validateJWT, (_req: Request, res: Response) => {
  return res.json({ msg: 'congratulation you are signed in!' });
});


export default router;