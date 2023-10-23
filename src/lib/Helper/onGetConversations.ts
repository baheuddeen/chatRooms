import ISocket from '../../models/ISocket';
import Conversation from '../../models/db/Conversation';
import ConversationParticipant from '../../models/db/ConversationParticipant ';


export default function({
    socket,
    conversationParticipantsDBHandler,
    conversationDBHandler,
}: {
    socket: ISocket
    conversationParticipantsDBHandler: ConversationParticipant,
    conversationDBHandler: Conversation,
}) {
    socket.on('getConversations', async () => {
        if (!socket.user_data) {
            return;
        }
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

export async function getConversations({
    conversationParticipantsDBHandler,
    socket,
    conversationDBHandler,
}) {
    const conversations = [];    
    const conversationsParticipants = await conversationParticipantsDBHandler.getConversationsByUserId(socket.user_data.id);
    for (let conv of conversationsParticipants) {
        console.log(conv.conversation_id);
        conversations.push(await conversationDBHandler.show(conv.conversation_id));
    }
    socket.conversations = conversations;
    
    return conversations;
}