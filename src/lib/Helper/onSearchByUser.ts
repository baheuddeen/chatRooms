import ISocket from '../../models/ISocket';
import User from '../../models/db/User';


export default function({
    socket,
    userDBHandler,
}: {
    socket: ISocket,
    userDBHandler: User,

}) {
    socket.on('searchByUser', async (args) => {        
        if (!socket.user_data || !args.user_name) {
            return;
        }        

        const users = await userDBHandler.getByUserName(args.user_name);
        socket.emit('searchResult', {
            users,
        });
    })
}