import { Server } from 'http';
import socketio from 'socket.io';
import Message from '../models/db/Message';
import validateJWTSocket from '../utilities/validateJWTSocket';
import ISocket from '../models/ISocket';
import Conversation from '../models/db/Conversation';
import ConversationParticipant from '../models/db/ConversationParticipant ';
import User from '../models/db/User';
import onJoinConversation from './Helper/onJoinConversation';
import onGetConversations from './Helper/onGetConversations';
import onMessage from './Helper/onMessage';
import onGetMessages from './Helper/onGetMessages';
import onSearchByUser from './Helper/onSearchByUser';
import onVoiceMessage from './Helper/onVoiceMessage';
import onPrepareVoiceMessage from './Helper/onPrepareVoiceMessage';

export default class ChatServer {
    httpServer: Server;
    io?: socketio.Server;
    userDBHandler: User;
    messageDBHandler: Message;
    conversationDBHandler: Conversation;
    conversationParticipantsDBHandler: ConversationParticipant;

    constructor(server: Server) {
        this.httpServer = server;
        this.messageDBHandler = new Message();
        this.conversationDBHandler = new Conversation();
        this.userDBHandler = new User();
        this.conversationParticipantsDBHandler = new ConversationParticipant();
    }

    listen() {
        this.io = new socketio.Server(this.httpServer);

        this.io.use(validateJWTSocket);
        
        this.io.on('connection', this.onConnection.bind(this))
    }

    public onConnection (socket: ISocket){
        onGetConversations({
            socket, 
            conversationParticipantsDBHandler: this.conversationParticipantsDBHandler,
            conversationDBHandler: this.conversationDBHandler
        });
        onJoinConversation({socket});
        onMessage({
            socket,
            io: this.io!,
            messageDBHandler: this.messageDBHandler,
        });
        onVoiceMessage({
            socket,
            io: this.io!,
            messageDBHandler: this.messageDBHandler,
        })
        onPrepareVoiceMessage({
            socket,
        });
        onGetMessages({
            socket,
            messageDBHandler: this.messageDBHandler,
        });
        onSearchByUser({
            socket,
            userDBHandler: this.userDBHandler,
        });
    }
}


