import express from 'express';
import dotenv from 'dotenv';
import validateJWT from '../../../utilities/validateJWT';

dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
  res.send({
    status: 'success',
  }); 
});

export default router;


