import ISocket from '../../models/ISocket';

export default function({
    socket,
}: {
    socket: ISocket
}) {
    socket.on('sendPeer', async (args) => {
        if (!socket.user_data) {
            return;
        }
        console.log('broadcating to' + args.conversation_id);
        console.log('data' + args.data);

        socket.broadcast.to(args.conversation_id).emit("recievePeer", args);
    });
}