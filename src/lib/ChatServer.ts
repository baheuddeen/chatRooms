import { Server } from 'http';
import socketio from 'socket.io';
import Message from '../models/db/Message';
import validateJWTSocket from '../utilities/validateJWTSocket';
import ISocket from '../models/ISocket';
import Conversation from '../models/db/Conversation';
import ConversationParticipant from '../models/db/ConversationParticipant ';
import User, { UserType } from '../models/db/User';
import onJoinConversation from './Helper/onJoinConversation';
import onGetConversations from './Helper/onGetConversations';
import onMessage from './Helper/onMessage';
import onGetMessages from './Helper/onGetMessages';
import onSearchByUser from './Helper/onSearchByUser';
import onVoiceMessage from './Helper/onVoiceMessage';
import onPrepareVoiceMessage from './Helper/onPrepareVoiceMessage';
import onSendPeer from './Helper/onSendPeer';
import onGetConversationParticipants from './Helper/onGetConversationParticipants';
import onRequestVoiceCall from './Helper/onRequestVoiceCall';
import onDisconnect from './Helper/onDisconnect';
import onAcceptVoiceCall from './Helper/onAcceptVoiceCall';
import preventMultipleConnections from './Helper/preventMultipleConnections';
import onJoinVoiceCall from './Helper/onJoinVoiceCall';
import onGetVoiceCallParticipants from './Helper/onGetVoiceCallParticipants';
import onLeaveVoiceCall from './Helper/onLeaveVoiceCall';
import onCreateConversation from './Helper/onCreateConversation';
import SocketPeer from './SocketPeer';

type SessionInfo = {
    user_name: string,
    email: string,
    socketId: string,
}

export type voiceCallSession = {
    conversation_id: number,
    users: UserType[],
    socketPeers: SocketPeer[],
}

export default class ChatServer {
    httpServer: Server;
    io?: socketio.Server;
    userDBHandler: User;
    messageDBHandler: Message;
    conversationDBHandler: Conversation;
    conversationParticipantsDBHandler: ConversationParticipant;
    static sessionsInfo: SessionInfo[] = [];
    static voiceCallSessions: voiceCallSession[] = [];

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
        preventMultipleConnections({
            socket,
        });
        onDisconnect({
            socket,
            io: this.io!,
        });
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
        onGetConversationParticipants({
            socket, 
            conversationParticipantsDBHandler: this.conversationParticipantsDBHandler,
            usersDBHandler: this.userDBHandler,
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
        onSendPeer( {
            socket,
        });
        onRequestVoiceCall( {
            socket,
            io: this.io!,
        });
        onAcceptVoiceCall( {
            socket,
            io: this.io!,
        });
        onJoinVoiceCall({
            socket,
            io: this.io!
        });
        onGetVoiceCallParticipants({
            socket,
        });
        onLeaveVoiceCall({
            socket,
            io: this.io!,
        });
        onCreateConversation({
            socket,
            conversationDBHandler: this.conversationDBHandler,
        })
    }
}


