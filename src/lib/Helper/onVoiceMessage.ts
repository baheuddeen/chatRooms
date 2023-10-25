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
    socket.on('sendVoiceMessage', async (args) => {    
        if(!(socket.user_data && socket.user_data.id)) {                
            return;
        }
        if (socket.voiceMessage?.binary) {
            console.log(absDir);
            const dirPath = path.join(absDir, 'private', `_uid-${socket.voiceMessage?.conversation_id}`);
            const filePath = path.join(dirPath, socket.voiceMessage?.filename);
            console.log(filePath);
            fs.appendFileSync(filePath, args.data);         
        }
        
        console.log(args.num, socket.voiceMessage?.length);
        
       if (args.num == socket.voiceMessage?.length) {
        for (const symmetric_key_user of socket.voiceMessage.symmetric_keys) {
            
            const sessionInfo = ChatServer.sessionsInfo.find(session => {
                return session.user_id == symmetric_key_user.receiver_id
            });
            if (sessionInfo) {
                io.sockets.sockets.get(sessionInfo.socketId).emit('message', {
                    filename: `${socket.voiceMessage?.filename}`,
                    sender_id: socket.user_data.id,
                    created: new Date(Date.now()).toISOString(),
                    conversation_id: socket.voiceMessage?.conversation_id,
                    type: 1,
                    iv: socket.voiceMessage.iv,
                    symmetric_key: symmetric_key_user.symmetric_key,
                    is_encrypted: 1,
                });                 
            }

                    
            messageDBHandler.create({
                body: 'voice_message',
                conversation_id: parseInt(socket.voiceMessage?.conversation_id!, 10),
                created: new Date(Date.now()).toISOString(),
                sender_id: socket.user_data.id,
                type: 1, // to be replaced with ENUM
                filename: `${socket.voiceMessage?.filename}`,
                is_encrypted: 1,
                receiver_id: symmetric_key_user.receiver_id,
                iv: socket.voiceMessage.iv,
                symmetric_key: symmetric_key_user.symmetric_key,
            }); 
        }
       

       }

    });
}