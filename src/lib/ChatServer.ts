import { Server } from 'http';
import socketio from 'socket.io';
import Message from '../models/db/Message';
import validateJWTSocket from '../utilities/validateJWTSocket';
import ISocket from '../models/ISocket';
import Conversation from '../models/db/Conversation';
import ConversationParticipant from '../models/db/ConversationParticipant ';

export default class ChatServer {
    httpServer: Server;
    io?: socketio.Server;
    messageDBHandler: Message;
    conversationDBHandler: Conversation;
    conversationParticipantsDBHandler: ConversationParticipant;

    constructor(server: Server) {
        this.httpServer = server;
        this.messageDBHandler = new Message();
        this.conversationDBHandler = new Conversation();
        this.conversationParticipantsDBHandler = new ConversationParticipant();
    }

    listen() {
        this.io = new socketio.Server(this.httpServer);

        this.io.use(validateJWTSocket);
        
        this.io.on('connection', this.onConnection.bind(this))
    }

    public onConnection (socket: ISocket){
        console.log('client connected to webSocket.');
        console.log(socket.user_data);
        this.onGetConversations(socket);
        this.onJoinConversation(socket);
        this.onMessage(socket);
        this.onGetMessages(socket);
    }
    // assignGuestName(socket: socketio.Socket) {
    //     const name = 'Guest' + this.guestNumber++;
    //     this.nickNames[socket.id] = name;
    //     socket.emit('nameResult', {
    //         success: true,
    //         name: name,
    //     });
    //     this.namesUsed.push(name);
    // }

    onJoinConversation(socket: ISocket) {
        socket.on('joinConversation', (args) => {
            console.log('i want to join');
            
            socket.join(args.conversation_id);
            socket.broadcast.to(args.conversation_id).emit('changeStatus', {
                user: socket.user_data?.user_name,
                status: 'online',
            });
        });
        
        // var usersInRoom = Array.from(this.io?.sockets.adapter.rooms.get('Lobby')!);
    }

    // handleNameChangeAttempts(socket: socketio.Socket) {
    //     socket.on('nameAttempt', (name) => {
    //         if (name.indexOf('Guest') == 0) {
    //             socket.emit('nameResult', {
    //                 success: false,
    //                 message: 'Names cannot begin with "Guest".'
    //             });
    //             return;
    //         } 
    //         if (this.namesUsed.indexOf(name) !== -1) {
    //             socket.emit('nameResult', {
    //                 success: false,
    //                 message: 'That name is already in use.'
    //             });
    //             return;
                
    //         }
    //         const previousName = this.nickNames[socket.id];
    //         const previousNameIndex = this.namesUsed.indexOf(previousName);
    //         this.namesUsed.push(name);
    //         this.nickNames[socket.id] = name;
    //         delete this.namesUsed[previousNameIndex];
    //         socket.emit('nameResult', {
    //             success: true,
    //             name: name
    //         });
    //         socket.broadcast.to(this.currentRoom[socket.id]).emit('message', {
    //             text: previousName + ' is now known as ' + name + '.'
    //         });
    //     });
    // }

    onMessage(socket: ISocket) {
        socket.on('message', (_event, args) => {    
            if(!(socket.user_data && socket.user_data.id)) {                
                return;
            }
            console.log('user name:', socket.user_data.email);
            
            this.io?.to((args.conversation_id)).emit('message', {
                body: args.text,
                sender_id: socket.user_data.id,
                created: new Date(Date.now()).toISOString(),
                conversation_id: args.conversation_id,
            }); 
            console.log( 'arg: ', args );
            
            this.messageDBHandler.create({
                body: args.text,
                conversation_id: args.conversation_id,
                created: new Date(Date.now()).toISOString(),
                sender_id: socket.user_data.id,
            }); 
        });
    }

    public async onGetConversations(socket: ISocket) {
        socket.on('getConversations', async () => {
            if (!socket.user_data) {
                return;
            }
            const conversations = [];    
            const conversationsParticipants = await this.conversationParticipantsDBHandler.getConversationsByUserId(socket.user_data.id);
            for (let conv of conversationsParticipants) {
                console.log(conv.conversation_id);
                conversations.push(await this.conversationDBHandler.show(conv.conversation_id));
            }
            socket.conversations = conversations;
            socket.emit('setConversation', {
                conversations,
            });
        });
    }

    public onGetMessages(socket: ISocket) {
        socket.on('getMessages', async () => {
            if (!socket.user_data || !socket.conversations) {
                return;
            }
            const messages = {} as {[key: number]: Message[]};
            for (let conv of socket.conversations) {
                messages[conv.id] = await this.messageDBHandler.getMessagesByConversationId(conv.id);
            }
            socket.emit('setMessages', {
                messages,
            });
        })
    }

    // handleRoomJoining(socket: socketio.Socket) {
    //     socket.on('join', (room) => {
    //         socket.leave(this.currentRoom[socket.id]);
    //         this.joinRoom(socket, room.newRoom);
    //     });
    // }

    // handleClientDisconnection(socket: socketio.Socket) {
    //     socket.on('disconnect', () => {
    //         var nameIndex = this.namesUsed.indexOf(this.nickNames[socket.id]);
    //         socket.broadcast.to(this.currentRoom[socket.id]).emit('message', {
    //             text: this.nickNames[socket.id] + ' has left',
    //         })
    //         delete this.namesUsed[nameIndex];
    //         delete this.nickNames[socket.id];
    //     });
    // }
}


