import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

type Content = {
  email: string,
  user_id: number
};

dotenv.config();

export default (jwt: string): Content => {
  let clientSecret = process.env.JWT_CLIENT_SECRET || 'client-secret';

  const payLoad = Jwt.verify(jwt, clientSecret);
  if (payLoad) {
    const content = JSON.parse(JSON.stringify(payLoad));
    return content;
  } 
  throw new Error('not valid jwt');
    
};