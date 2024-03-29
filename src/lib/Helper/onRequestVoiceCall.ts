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
    socket.on('requestVoiceCall', async (args) => {
        if (!socket.user_data) {
            return;
        }

        console.log(ChatServer.sessionsInfo);
        

        const sessionInfo = ChatServer.sessionsInfo.find((sessionInfo) => {
            return sessionInfo.email == args.second_peer_email;
        })

        console.log('session infoe', sessionInfo);
        

        if (!sessionInfo) {
            console.log(args.email, ' this user is not online!');
            return;
        }
        
        io.sockets.sockets.get(sessionInfo.socketId)?.emit('peerToPeerOffer', {
            data: args.data,
            second_peer_email: socket.user_data.email,
        })
    });
}