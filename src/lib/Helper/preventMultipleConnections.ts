import ISocket from '../../models/ISocket';
import socketio from 'socket.io';
import ChatServer from '../ChatServer';

export default function({
    socket,
    io,
}: {
    socket: ISocket,
    io: socketio.Server,
}) {
    if (!socket.user_data) {
        return;
    }
    const sessionInfo = ChatServer.sessionsInfo.find((sessionInfo) => {
        return sessionInfo.email == socket.user_data!.email
    });
    if (sessionInfo) {
        // if the user is already logged in from another device
        const newSessionInfo = {
            user_name: socket.user_data.user_name,
            email: socket.user_data.email,
            socketId: socket.id,
            user_id: socket.user_data.id,
        };
        io.sockets.sockets.get(sessionInfo.socketId).emit('otherDeviceIsLoggedIn', newSessionInfo);
        ChatServer.sessionsInfo.push(newSessionInfo);
        io.sockets.sockets.get(sessionInfo.socketId).disconnect();
        return;
    }
    ChatServer.sessionsInfo.push({
        user_name: socket.user_data.user_name,
        email: socket.user_data.email,
        socketId: socket.id,
        user_id: socket.user_data.id,
    });
}