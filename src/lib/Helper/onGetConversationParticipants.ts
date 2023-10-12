import ISocket from '../../models/ISocket';
import ConversationParticipant from '../../models/db/ConversationParticipant ';
import User from '../../models/db/User';


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
        if (!socket.user_data) {
            return;
        }
        const users = [];
        const convParts = await conversationParticipantsDBHandler.getConversationsParticipantByConvId(args.conversation_id);

        for (const convPart of convParts) {
            users.push(await usersDBHandler.show(convPart.user_id));
        }        
        socket.emit('setConversationParticipant', {
            users,
            conversation_id: args.conversation_id,
        });
    });
}