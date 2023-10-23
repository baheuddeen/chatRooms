import ISocket from '../../models/ISocket';
import Conversation from '../../models/db/Conversation';
import ConversationParticipant from '../../models/db/ConversationParticipant ';
import CreateConversationInviteJWT from '../../utilities/genereateConversationInviteJWT';
import { getConversations } from './onGetConversations';

export default function({
    socket,
    conversationDBHandler,
    conversationParticipantsDBHandler,
}: {
    socket: ISocket
    conversationDBHandler: Conversation,
    conversationParticipantsDBHandler: ConversationParticipant,
}) {
    socket.on('createConversation', async (args) => {
        if (!socket.user_data) {
            return;
        }        
        const createdConversation = await conversationDBHandler.create({
            conversation_participant: 1,
            title: args.title,
            conversation_type: args.conversation_type,
        });
        await conversationParticipantsDBHandler.create({
            conversation_id: createdConversation.id,
            user_id: socket.user_data.id,
        });
        const jwt = CreateConversationInviteJWT(createdConversation);
        const inviteLink = `/joinRoom/${createdConversation.id}?key=${jwt}`;
        console.log(inviteLink);
        
        socket.emit('conversationCreated', {
            inviteLink,
        });
        const conversations = await getConversations({
            conversationParticipantsDBHandler,
            socket,
            conversationDBHandler,
        });
        socket.emit('setConversation', {
            conversations,
        });
    });
}