import ISocket from '../../models/ISocket';
import ConversationParticipant from '../../models/db/ConversationParticipant ';
import User from '../../models/db/User';
import ChatServer from '../ChatServer';


export default function({
    socket,
}: {
    socket: ISocket
}) {
    socket.on('getVoiceCallParticipants', async (args) => {
        if (!socket.user_data || ! socket.conversations) {
            return;
        }

        const conversationIds = socket.conversations.map(conv => conv.id);


        const voice_calls_participants = {} as any;
        ChatServer.voiceCallSessions.filter((session) => {
            return conversationIds.includes(session.conversation_id);
        }).forEach((item) => {
            voice_calls_participants[item.conversation_id] = item.users;
        });

        console.log('voice_calls_participants', voice_calls_participants);
        

        
        socket.emit('setVoiceCallParticipants', {
            voice_calls_participants,
        });
    });
}