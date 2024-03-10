import ISocket from '../../models/ISocket';
import ConversationParticipant from '../../models/db/ConversationParticipant ';
import User from '../../models/db/User';
import socketio from 'socket.io';
import ChatServer from '../ChatServer';

export default function({
    socket,
    io,
}: {
    socket: ISocket,
    io: socketio.Server,
}) {
    socket.on('joinVoiceCall', async (args) => {        
        if (!socket.user_data) {
            return;
        }

        console.log(ChatServer.sessionsInfo);

        // make sure that this user has access to this conversation
        const x = socket.conversations?.find((conv) => {
            return conv.id == args.conversation_id;
        });
        if (!x) {
            console.log('user does not have access to this conversation');
            return;
        }

        let voiceCallSession = ChatServer.voiceCallSessions.find((session) => {
            return session.conversation_id == args.conversation_id;
        });

        

        if (!voiceCallSession) {
            voiceCallSession = {
                conversation_id: args.conversation_id,
                users: [
                    socket.user_data,
                ],
            }
            ChatServer.voiceCallSessions.push(voiceCallSession);

        } else {
            voiceCallSession.users.push(socket.user_data);
        }
        socket.activeVoiceCallId = args.conversation_id;
        console.log('voiceCallToJoin', args.conversation_id);
        
        io.to(args.conversation_id).emit('updateVoiceCallParticipants', {
            action: 'join',
            conversation_id: socket.activeVoiceCallId,
            users: voiceCallSession.users, 
            user: socket.user_data,
        });

    });
}