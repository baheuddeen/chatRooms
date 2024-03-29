import ISocket from '../../models/ISocket';
import socketio from 'socket.io';
import Message from '../../models/db/Message';


export default function({
    socket,
    messageDBHandler,
}: {
    socket: ISocket,
    messageDBHandler: Message,

}) {
    socket.on('getMessages', async () => {
        if (!socket.user_data || !socket.conversations) {
            return;
        }
        const messages = {} as {[key: number | string]: Message[]};
        for (let conv of socket.conversations) {
            if(!conv.id) {
                continue;
            }
            messages[conv.id] = await messageDBHandler.getMessagesByConversationId(conv.id);
        }
        socket.emit('setMessages', {
            messages,
        });
    })
}