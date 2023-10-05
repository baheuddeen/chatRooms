import ISocket from '../../models/ISocket';


export default function({
    socket
}: {
    socket: ISocket
}) {
    socket.on('joinConversation', (args) => {
        console.log('i want to join');
        
        socket.join(args.conversation_id);
        socket.broadcast.to(args.conversation_id).emit('changeStatus', {
            user: socket.user_data?.user_name,
            status: 'online',
        });
    });  
}