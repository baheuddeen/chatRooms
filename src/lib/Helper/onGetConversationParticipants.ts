import ISocket from '../../models/ISocket';
import ConversationParticipant from '../../models/db/ConversationParticipant ';
import User from '../../models/db/User';
import ChatServer from '../ChatServer';


export default function({
    socket,
    conversationParticipantsDBHandler,
    usersDBHandler,
}: {
    socket: ISocket
    conversationParticipantsDBHandler: ConversationParticipant,
    usersDBHandler: User;
}) {
    socket.on('getConversationParticipant', async (args) => {
        if (!socket.user_data || ! socket.conversations) {
            return;
        }

        const conversationIds = socket.conversations.map(conv => conv.id!);
        
        if (!conversationIds.length) {
            return;
        }
        const convParts = await conversationParticipantsDBHandler.getConversationsParticipantByConvId(conversationIds);
        console.log(convParts);
        const conversation_participants = {} as any;
        convParts.forEach((convPart) => {
            if (!conversation_participants[convPart.conversation_id]) {
                conversation_participants[convPart.conversation_id] = [];
            }
            conversation_participants[convPart.conversation_id].push({
                user_name: convPart.user_name,
                email: convPart.email,
                public_key: convPart.public_key,
                id: convPart.id,
                status: ChatServer.sessionsInfo.find(session => session.user_id == convPart.id) ? 'online' : 'offline',
            });
        });
        
        socket.emit('setConversationParticipant', {
            conversation_participants,
        });
    });
}