import ISocket from '../../models/ISocket';
import socketio from 'socket.io';
import Message from '../../models/db/Message';
import ChatServer from '../ChatServer';
import { leaveVoiceCall } from './onLeaveVoiceCall';

export default function({
    socket,
    io,
}: {
    socket: ISocket,
    io: socketio.Server,
}) {
    socket.on('disconnect', (_event, args) => {    
        if(!(socket.user_data && socket.user_data.id)) {                
            return;
        }
        console.log('user name: disconnected', socket.user_data.email);
        const sessionInfo = ChatServer.sessionsInfo.find((session) => {
            return session.email == socket.user_data?.email;
        });
        if (!sessionInfo) {
            console.log('no one is logged with this email');
            return;
        }

        leaveVoiceCall({
            socket,
            io,
        });

        const sessionInfoIndex = ChatServer.sessionsInfo.indexOf(sessionInfo);
        ChatServer.sessionsInfo.splice(sessionInfoIndex, 1); 
    });
}