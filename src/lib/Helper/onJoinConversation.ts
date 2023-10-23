import ISocket from '../../models/ISocket';
import User from '../../models/db/User';


export default function({
    socket,
    userDBHandler,
}: {
    socket: ISocket,
    userDBHandler: User,
}) {
    socket.on('joinConversation', async (args) => {
        console.log('i want to join');
        
        socket.join(args.conversation_id);
        const user = await userDBHandler.show(socket.user_data.id);
        socket.user_data.public_key = user.public_key;
        socket.user_data.status = 'online';
        socket.broadcast.to(args.conversation_id).emit('changeStatus', {
            user: socket.user_data,
            conversation_id: args.conversation_id,
        });
    });  
}