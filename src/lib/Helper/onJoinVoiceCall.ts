import ISocket from '../../models/ISocket';
import ConversationParticipant from '../../models/db/ConversationParticipant ';
import User from '../../models/db/User';
import socketio from 'socket.io';
import ChatServer from '../ChatServer';
import { voiceCallSession } from '../ChatServer';
import SocketPeer from '../SocketPeer';

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
            // should i have only one stram with multiple tracks! i don't know yet    
            const socketPeer = new SocketPeer({
                conversationId: args.conversation_id,
                secondPeerEmail: socket.user_data.email,
                socket,
            });
            voiceCallSession = {
                conversation_id: args.conversation_id,
                users: [
                    socket.user_data,
                ],
                socketPeers: [
                    socketPeer,
                ],
            }
            ChatServer.voiceCallSessions.push(voiceCallSession);

        } else {
            const socketPeer = new SocketPeer({
                conversationId: args.conversation_id,
                secondPeerEmail: socket.user_data.email,
                socket,
            });
            voiceCallSession.socketPeers.push(socketPeer);
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