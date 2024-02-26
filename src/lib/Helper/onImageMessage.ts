import ISocket from '../../models/ISocket';
import socketio from 'socket.io';
import fs from 'fs';
import Message from '../../models/db/Message';
import path from 'path';
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
    const absDir = path.resolve();
    socket.on('sendImageMessage', async (args) => {    
        if(!(socket.user_data && socket.user_data.id)) {                
            return;
        }
        if (socket.imageMessage?.binary) {
            console.log(absDir);
            const dirPath = path.join(absDir, 'private', `_uid-${socket.imageMessage?.conversation_id}`);
            const filePath = path.join(dirPath, socket.imageMessage?.filename);
            console.log(filePath);
            fs.appendFileSync(filePath, args.data);         
        }
        
        console.log(args.num, socket.imageMessage?.length);
        
       if (args.num == socket.imageMessage?.length) {
        for (const symmetric_key_user of socket.imageMessage.symmetric_keys) {
            
            const sessionInfo = ChatServer.sessionsInfo.find(session => {
                return session.user_id == symmetric_key_user.receiver_id
            });
            if (sessionInfo) {
                io.sockets.sockets.get(sessionInfo.socketId).emit('message', {
                    filename: `${socket.imageMessage?.filename}`,
                    sender_id: socket.user_data.id,
                    created: new Date(Date.now()).toISOString(),
                    conversation_id: socket.imageMessage?.conversation_id,
                    type: 2,
                    iv: socket.imageMessage.iv,
                    symmetric_key: symmetric_key_user.symmetric_key,
                    is_encrypted: 1,
                });                 
            }

                    
            messageDBHandler.create({
                body: 'Image_message',
                conversation_id: parseInt(socket.imageMessage?.conversation_id!, 10),
                created: new Date(Date.now()).toISOString(),
                sender_id: socket.user_data.id,
                type: 2, // to be replaced with ENUM 0 Text, 1 Voice, 2 Image
                filename: `${socket.imageMessage?.filename}`,
                is_encrypted: 1,
                receiver_id: symmetric_key_user.receiver_id,
                iv: socket.imageMessage.iv,
                symmetric_key: symmetric_key_user.symmetric_key,
            }); 
        }
       

       }

    });
}