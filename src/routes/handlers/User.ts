import User from '../../models/db/User';
import express, { Request, Response } from 'express';
import verifySignup from '../../utilities/verifyLogin';
import validateJWT from '../../utilities/validateJWT';
import generateJWT from '../../utilities/generateJWT';
import IRequest from '../../models/IRequest';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utilities/sendEmail';

const router = express.Router();
const user = new User();

// Show All user
const index = async (req: Request, res: Response) => {    
  const conversations = await user.index();
  res.json(conversations);
};

// Show user by Id
const show = async (req: Request, res: Response) => {  
  const id = parseInt(req.params.id, 10);
  try {
    const selectedUser = await user.show(id);
    res.json(selectedUser);
  } catch (err) {
    res.status(400).send(`${err}`);
  }
};

const create = async (req: Request, res: Response) => {
  const newUser = req.body;
  
  console.log('new', newUser);
  
  try {
    const createdUser = await user.create(newUser);
    res.cookie('_jwt', generateJWT(createdUser));
    const verifiedUser = createdUser;
    verifiedUser.verified = 1;
    await sendEmail({
      email: req.body.email,
      username: req.body.user_name,
      jwt: generateJWT(verifiedUser),
    })
    return res.json({success: true});
  } catch (err) {
    return res.status(400).send({ status: false, err: `${err}` });
  }
};

const verify = async (req:IRequest, res: Response) => {  
  try {
    if(!req.user_data) {
      throw new Error('unvalid token')
    }
    const reqUser = await user.verifyUser(req.user_data.email);  
    res.cookie('_jwt', generateJWT(reqUser));
    return res.redirect('/');
  } catch (err) {
    return res.status(400).send({ status: false, err: `${err}` });
  }
}

const check = async (req: IRequest, res: Response) => {
  try {
    if(!req.user_data) {
      throw new Error('unvalid token')
    }
    const reqUser = await user.getUserByEmail(req.user_data.email);  
    if (req.user_data.verified != reqUser.verified) {
      req.user_data = reqUser;
      res.cookie('_jwt', generateJWT(reqUser));
    }
    return res.json(req.user_data);
  } catch (err) {
    return res.status(400).send({ status: false, err: `${err}` });
  }
}

const login = async (req: Request, res: Response) => {  
  try { 
    const reqUser = await user.getUserByEmail(req.body.email);    
    const valid = bcrypt.compareSync(req.body.password, reqUser.password);    
    if (!valid) {
      return res.status(401).json({ msg: 'wrong username or password' });
    }
    res.cookie('_jwt', generateJWT(reqUser));
    return res.status(200).json({ msg: 'logged in successfly' });
  } catch(err) {    
    return res.status(401).json({ msg: 'invalid user information' });
  }
};

// TODO ADD Admin constrian
// router.get('/', validateJWT, index); 
router.get('/check', validateJWT, check);
router.get('/verify', validateJWT, verify);
router.get('/:id', validateJWT, show); 
router.post('/create', verifySignup, create);
router.post('/login', login);

export default router;
