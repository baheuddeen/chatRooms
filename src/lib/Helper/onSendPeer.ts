import ISocket from '../../models/ISocket';

export default function({
    socket,
}: {
    socket: ISocket
}) {
    socket.on('sendPeer', async (data) => {
        if (!socket.user_data) {
            return;
        }
        socket.broadcast.emit("recievePeer", data);
    });
}