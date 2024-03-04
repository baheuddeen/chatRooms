import ISocket from '../../models/ISocket';
import ChatServer from '../ChatServer';

export default function({
    socket,
}: {
    socket: ISocket
}) {
    if (!socket.user_data) {
        return;
    }
    const sessionInfo = ChatServer.sessionsInfo.find((sessionInfo) => {
        return sessionInfo.email == socket.user_data!.email
    });
    if (sessionInfo) {
        // socket.emit('otherDeviceIsLoggedIn', sessionInfo);
        // socket.disconnect();
        return;
    }
    ChatServer.sessionsInfo.push({
    user_name: socket.user_data.user_name,
    email: socket.user_data.email,
    socketId: socket.id,
    user_id: socket.user_data.id,
    });
}