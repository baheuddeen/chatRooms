import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ConversationType } from '../models/db/Conversation';

dotenv.config();

export default function generateConversationInviteJWT(conversation: ConversationType) {
  let clientSecret = process.env.JWT_CLIENT_SECRET || 'client-secret';
  const jwt = Jwt.sign({
    'sub': '1234567890',
    'conversation_id': conversation.id,
  },
  clientSecret );
  return jwt;
}