import ISocket from '../../models/ISocket';
import socketio from 'socket.io';
import Message from '../../models/db/Message';
import path from 'path';
import fs from 'fs';


export default function({
    socket,
}: {
    socket: ISocket,

}) {
    socket.on('prepareVoiceMessage', (args) => {    
        if(!(socket.user_data && socket.user_data.id)) {                
            return;
        }

        const absDir = path.resolve();
        const dirPath = path.join(absDir, 'private', `_uid-${args.conversation_id}`);
        const isExist = fs.existsSync(dirPath);
        if (!isExist) {
            fs.mkdirSync(dirPath, {
                recursive: true,
            });
        }
        socket.voiceMessage = args;    
        socket.emit('startSendingTheVoiceMessage');
    });
}