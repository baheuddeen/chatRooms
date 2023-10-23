import ISocket from '../../models/ISocket';
import socketio from 'socket.io';
import fs from 'fs';
import Message from '../../models/db/Message';
import path from 'path';

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
        console.log('user name:', socket.user_data.email);
        console.log(socket.voiceMessage);
        if (socket.voiceMessage?.binary) {
            console.log(absDir);
            const dirPath = path.join(absDir, 'private', `_uid-${socket.voiceMessage?.conversation_id}`);
            const filePath = path.join(dirPath, socket.voiceMessage?.filename);
            console.log(filePath);
            fs.appendFileSync(filePath, args.data);         
        }
        
        console.log(args.num, socket.voiceMessage?.length);
        
       if (args.num == socket.voiceMessage?.length) {
        io?.to((socket.voiceMessage?.conversation_id!)).emit('message', {
            filename: `${socket.voiceMessage?.filename}`,
            sender_id: socket.user_data.id,
            created: new Date(Date.now()).toISOString(),
            conversation_id: socket.voiceMessage?.conversation_id,
            type: 1,
        }); 
        
        messageDBHandler.create({
            body: 'voice_message',
            conversation_id: parseInt(socket.voiceMessage?.conversation_id!, 10),
            created: new Date(Date.now()).toISOString(),
            sender_id: socket.user_data.id,
            type: 1, // to be replaced with ENUM
            filename: `${socket.voiceMessage?.filename}`,
            is_encrypted: 0, // to be encreypted in the future!
        }); 
       }

    });
}