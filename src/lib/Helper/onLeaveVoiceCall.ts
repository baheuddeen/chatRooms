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
    socket.on('leaveVoiceCall', async (args) => {
        if (!socket.user_data) {
            return;
        }


        leaveVoiceCall({
            socket,
            io,
        });
    });
}

export function leaveVoiceCall({
    socket,
    io,
}: {
    socket: ISocket,
    io: socketio.Server,
}) {
    console.log('it should leave !', socket.activeVoiceCallId, socket.user_data?.email);
    
    if (!socket.user_data || !socket.activeVoiceCallId) {
        return;
    }
    let voiceCallSession = ChatServer.voiceCallSessions.find((session) => {
        return session.conversation_id == socket.activeVoiceCallId;
    });
    console.log('voiceCallSession before', voiceCallSession);
    
    if (!voiceCallSession) {
        return
    } 
    const i = voiceCallSession.users.indexOf(socket.user_data);
    if(i == -1 ) {
        return;
    }
    voiceCallSession.users.splice(i, 1);
    console.log('voiceCallSession after', voiceCallSession, socket.activeVoiceCallId.toString());
    io.to(socket.activeVoiceCallId as any).emit('updateVoiceCallParticipants', {
        action: 'leaves',
        conversation_id: socket.activeVoiceCallId,
        users: voiceCallSession.users, 
    });
}