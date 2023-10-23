import ISocket from "../../models/ISocket";
import User from "../../models/db/User";

export default function({
    socket,
    userDBHandler,
}: {
    socket: ISocket,
    userDBHandler: User,
}) {
    socket.on('updatePublicKey', (args) => {            
        if(!(socket.user_data && socket.user_data.id)) {                
            return;
        }
        console.log('type', typeof args.public_key);
        userDBHandler.updatePublicKey({
            id: socket.user_data.id,
            public_key: args.public_key,
        });
    });  
    // TO DO NOTIFY OTHER PEOPLE WITH THE NEW PuBLIC KEY!
}