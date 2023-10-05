import ISocket from '../../models/ISocket';
import socketio from 'socket.io';
import Message from '../../models/db/Message';


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
        console.log('user name:', socket.user_data.email);
        
        io?.to((args.conversation_id)).emit('message', {
            body: args.text,
            sender_id: socket.user_data.id,
            created: new Date(Date.now()).toISOString(),
            conversation_id: args.conversation_id,
        }); 
        console.log( 'arg: ', args );
        
        messageDBHandler.create({
            body: args.text,
            conversation_id: args.conversation_id,
            created: new Date(Date.now()).toISOString(),
            sender_id: socket.user_data.id,
        }); 
    });
}