import ISocket from '../../models/ISocket';
import socketio from 'socket.io';
import Message from '../../models/db/Message';
import ChatServer from '../ChatServer';


export default function({
    socket,
    io,
    messageDBHandler,
}: {
    socket: ISocket,
    io: socketio.Server,
    messageDBHandler: Message,

}) {
    socket.on('message', (_event, args) => {    
        if(!(socket.user_data && socket.user_data.id)) {                
            return;
        }
        console.log('hmmm', ChatServer.sessionsInfo);
        const sessionInfo = ChatServer.sessionsInfo.find(session => {
            return session.user_id == args.receiver_id
        });
        console.log( 'arg: ', args, sessionInfo );

        if (sessionInfo) {
            io.sockets.sockets.get(sessionInfo.socketId).emit('message', {
                body: args.text,
                sender_id: socket.user_data.id,
                created: new Date(Date.now()).toISOString(),
                conversation_id: args.conversation_id,
                type: 0,
                is_encrypted: args.is_encrypted,
                receiver_id: args.receiver_id,
            }); 
            
        }
        console.log( 'arg: ', args );
        
        messageDBHandler.create({
            body: args.text,
            conversation_id: args.conversation_id,
            created: new Date(Date.now()).toISOString(),
            sender_id: socket.user_data.id,
            type: 0,
            is_encrypted: args.is_encrypted,
            receiver_id: args.receiver_id,
        }); 
    });
}