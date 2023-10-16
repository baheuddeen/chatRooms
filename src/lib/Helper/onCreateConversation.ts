import ISocket from '../../models/ISocket';
import Conversation from '../../models/db/Conversation';
import CreateConversationInviteJWT from '../../utilities/genereateConversationInviteJWT';

export default function({
    socket,
    conversationDBHandler,
}: {
    socket: ISocket
    conversationDBHandler: Conversation,
}) {
    socket.on('createConversation', async (args) => {
        if (!socket.user_data) {
            return;
        }
        const createdConversation = await conversationDBHandler.create({
            conversation_participant: 1,
            title: args.title,
        });
        const jwt = CreateConversationInviteJWT(createdConversation);
        const inviteLink = `/joinRoom/${createdConversation.id}?key=${jwt}`;
        console.log(inviteLink);
        
        socket.emit('conversationCreated', {
            inviteLink,
        });
    });
}