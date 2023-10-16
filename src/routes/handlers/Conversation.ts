import ConversationParticipant from '../../models/db/ConversationParticipant ';
import express, { Response } from 'express';
import IRequest from '../../models/IRequest';
import validateJWT from '../../utilities/validateJWT';
import validateConversationInviteJWT from '../../utilities/validateConversationInviteJWT';

const router = express.Router();
const conversationParticipant = new ConversationParticipant();

const joinConversation =async (req:IRequest, res: Response) => {
    conversationParticipant.create({
        conversation_id: req.conversationId!,
        user_id: req.user_data?.id!,
    });
    res.redirect('/');   
}

router.get('/:id', validateJWT, validateConversationInviteJWT, joinConversation);

export default router;
