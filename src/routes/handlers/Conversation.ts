import ConversationParticipant from '../../models/db/ConversationParticipant ';
import express, { Response } from 'express';
import IRequest from '../../models/IRequest';
import validateJWT from '../../utilities/validateJWT';
import validateConversationInviteJWT from '../../utilities/validateConversationInviteJWT';

const router = express.Router();
const conversationParticipant = new ConversationParticipant();

const joinConversation =async (req:IRequest, res: Response) => {
    // check that this user is not participant to this conversation.
    if (!req.user_data) {
        return res.send("please login first");
    }
    const convsParticpants = (await conversationParticipant.getConversationsParticipantByConvId( [req.conversationId]));
    const isAlreadyParticipat = convsParticpants.find((convPar) => convPar.email == req.user_data.email);
    
    if (isAlreadyParticipat) {
        console.log('you have joined this conv before!');
        return res.redirect('/chat');
    }
    await conversationParticipant.create({
        conversation_id: req.conversationId!,
        user_id: req.user_data.id!,
    });
    res.redirect('/chat');   
}

router.use(validateJWT, validateConversationInviteJWT, joinConversation);

export default router;
