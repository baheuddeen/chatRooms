import { io, Socket } from "socket.io-client";
import { Ref } from "vue";
import { Conversation, Message } from "../models/Types";
import User, { UserType } from "../models/User";
import Services from "./Services";
import ChatFacet from "../components/ChatPage/ChatFacet";

export default class SocketIoClient {
    public readonly state: Ref<{connected: boolean}>;
    public readonly messages: Ref<Message[]>;
    public readonly activeConversationId: Ref<number>;
    public readonly conversations: Ref<Conversation[]>;
    public cashMessages: Ref<{[key: number]: Message[]}>;
    public socket: Socket ;

    constructor({
        state,
        messages,
        conversations,
        cashMessages,
        activeConversationId,
    }: {
        state: Ref<{connected: boolean}>,
        messages: Ref<Message[]>,
        conversations: Ref<Conversation[]>,
        cashMessages: Ref<{[key: number]: Message[]}>,
        activeConversationId: Ref<number>,
    }) {
    this.state = state;
    this.messages = messages;
    this.conversations = conversations;
    this.activeConversationId = activeConversationId;
    User.users = [];
    this.cashMessages = cashMessages;
    }

    public connect() {
        const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
        this.socket = io(URL);
        this.socket.on("connect", this.onConnect.bind(this));
        this.socket.on('disconnect', this.onDisConnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('setConversation', this.onSetConversations.bind(this));
        this.socket.on('setMessages', this.onSetMessages.bind(this));
    }

    private onConnect(){
        console.log('connected to socket!');
        User.users.push(User.getUser());
        this.state.value.connected = true;
    }

    private onDisConnect(){
        console.log('disconnected to socket!');
        this.state.value.connected = false;
    }

    private async onMessage (args) {
        console.log('recieved message !');        
        console.log(args); 
        if(this.activeConversationId.value == args.conversation_id) {
            this.messages.value.push(await ChatFacet.prepareMessage(args));
        } else {
            console.log('notifie other conversation');
        }

        this.cashMessages.value[args.conversation_id].push(args);
        console.log('chashed', this.cashMessages.value);
        
    }

    public sendMessage(message: {
        text: string,
        conversation_id: number,
    }) {
        this.socket.send('message', message);
    }

    public joinConversation({
        conversation_id,
    }: {
        conversation_id: number,
    }){        
        this.socket.emit('joinConversation', {
            conversation_id,
        });
    }

    public getConversations() {
        console.log('front, Get my Conversation!');
        this.socket.emit('getConversations');
    }

    public onSetConversations(args: any) {
        console.log('received converstions:', args);  
        this.conversations.value = args.conversations;
        this.conversations.value.forEach((conversation) => {
            this.joinConversation({
                conversation_id: conversation.id,
            });
        });
        this.getMessages();
    }

    public getMessages() {
        console.log('front, Get my Messages!');
        this.socket.emit('getMessages');
    }

    public onSetMessages(args: any) {
        console.log('received Messages:', args);
        
        this.cashMessages.value = args.messages;
    }
}