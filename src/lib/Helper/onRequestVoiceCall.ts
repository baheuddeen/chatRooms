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
    socket.on('signal', async (args) => {
        if (!socket.user_data) {
            return;
        }        
        console.log('signal', args);
        
        const voiceCallSession = ChatServer.voiceCallSessions.find((session) => {
            return session.users.indexOf(socket.user_data) != -1;
        });

        if(!voiceCallSession) {
            console.log('this user has not access to this voice call');
            return;
        }
        const secondPeerUser = voiceCallSession.users.find((user) => {
            return args.secondPeerEmail == user.email
        });

        if (!secondPeerUser) {
            console.log('second peer not found');
            return;
        }

        const secondPeerUserSessionInfo = ChatServer.sessionsInfo.find((sessionInfo) => {
            return sessionInfo.email == args.secondPeerEmail;
        }); 
        console.log('sending signal to', secondPeerUserSessionInfo.socketId);
        
        io.sockets.sockets.get(secondPeerUserSessionInfo.socketId)?.emit('signal', {
            data: args.data,
            user: socket.user_data,
        });        
    });
}