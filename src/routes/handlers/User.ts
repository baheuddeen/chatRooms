import User from '../../models/db/User';
import express, { Request, Response } from 'express';
import verifySignup from '../../utilities/verifyLogin';
import validateJWT from '../../utilities/validateJWT';
import generateJWT from '../../utilities/generateJWT';
import IRequest from '../../models/IRequest';
import bcrypt from 'bcrypt';

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
  const newConversation = req.body;
  
  console.log('new', newConversation);
  
  try {
    const createdUser = await user.create(newConversation);
    res.cookie('_jwt', generateJWT(createdUser));
    return res.json({success: true, created: createdUser});
  } catch (err) {
    return res.status(400).send({ status: false, err: `${err}` });
  }
};

const check = async (req: IRequest, res: Response) => {
  console.log('i am in check');

  try {
    if(!req.user_data) throw new Error('no User Data');
    
    const foundUser = await user.check(req.user_data);
    return res.json(foundUser);
  } catch (err) {
    return res.status(400).send({ status: false, err: `${err}` });
  }
}

const login = async (req: Request, res: Response) => {
  const password = await user.getPassword(req.body.email);
  const valid = bcrypt.compareSync(req.body.password, password);  
    
  if (!valid) {
    return res.status(401).json({ msg: 'invalid user information' });
  }
  res.cookie('_jwt', generateJWT(req.body.email));
  res.send('logged in successfully !');
};

// TODO ADD Admin constrian
router.get('/', validateJWT, index); 
router.get('/check', validateJWT, check);
router.get('/:id', validateJWT, show); 
router.post('/create', verifySignup, create);
router.post('/login', login);

export default router;
