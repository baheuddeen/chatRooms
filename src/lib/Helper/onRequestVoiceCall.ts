import ISocket from '../../models/ISocket';
import ConversationParticipant from '../../models/db/ConversationParticipant ';
import User from '../../models/db/User';
import socketio from 'socket.io';
import ChatServer from '../ChatServer';
import SocketPeer from '../SocketPeer';


export default function({
    socket,
    io,
}: {
    socket: ISocket,
    io: socketio.Server,
}) {
    socket.on('requestVoiceCall', async (args) => {
        if (!socket.user_data) {
            return;
        }        

        const voiceCallSession = ChatServer.voiceCallSessions.find((session) => {
            return session.users.indexOf(socket.user_data) != -1;
        });

        if(!voiceCallSession) {
            console.log('this user has not access to this voice call');
            return;
        }
        voiceCallSession.socketPeers.find((socketPeer) => {
            return socketPeer.secondPeerEmail == socket.user_data.email
        })?.signal(args.data);
        
    });
}