import { io, Socket } from "socket.io-client";
import { Ref } from "vue";
import { Conversation, Message } from "../models/Types";
import User, { UserType } from "../models/User";
import Services from "./Services";
import ChatFacet from "../components/ChatPage/ChatFacet";
import SearchFacet from "../components/ChatPage/SearchFacet";
import SocketPeer from "./SocketPeer";

export default class SocketIoClient {
    public static socket: Socket ;
    private static chat: ChatFacet;
    private static search: SearchFacet;
    private static sendingBinaryData: Ref<boolean>;



    public static connect() {
        const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
        SocketIoClient.socket = io(URL);
        SocketIoClient.socket.on("connect", SocketIoClient.onConnect);
        SocketIoClient.socket.on('disconnect', SocketIoClient.onDisConnect);
        SocketIoClient.socket.on('message', SocketIoClient.onMessage);
        SocketIoClient.socket.on('setConversation', SocketIoClient.onSetConversations);
        SocketIoClient.socket.on('setMessages', SocketIoClient.onSetMessages);
        SocketIoClient.socket.on('searchResult', SocketIoClient.onGetSearchResult);
        SocketIoClient.socket.on('startSendingTheVoiceMessage', SocketIoClient.onStartSendingVoiceMessage);
        SocketIoClient.socket.on('recievePeer', SocketIoClient.onRecievePeer.bind(this));
    }

    public static subscribeChat({
        chat,
    }: { 
        chat: ChatFacet
    }) {
        SocketIoClient.chat = chat;
    }

    public static subscribeSearch({
        search,
    }: { 
        search: SearchFacet
    }) {
        SocketIoClient.search = search;
    }

    public static subscribeUpload({
        sendingBinaryData,
    }: {
        sendingBinaryData: Ref<boolean>,
    }) {
        SocketIoClient.sendingBinaryData = sendingBinaryData;
    }

    private static onConnect(){
        console.log('connected to socket!');
        User.users.push(User.getUser());
        SocketIoClient.chat.state.value.connected = true;
    }

    private static onDisConnect(){
        console.log('disconnected to socket!');
        SocketIoClient.chat.state.value.connected = false;
    }

    private static async onMessage (args) {
        console.log('recieved message !');        
        console.log(args); 
        if(SocketIoClient.chat.activeConversationId.value == args.conversation_id) {
            SocketIoClient.chat.messages.value.push(await ChatFacet.prepareMessage(args));
        } else {
            console.log('notifie other conversation');
        }

        SocketIoClient.chat.cashMessages.value[args.conversation_id].push(args);
        console.log('chashed', SocketIoClient.chat.cashMessages.value);
        
    }

    public static sendMessage(message: {
        text: string,
        conversation_id: number,
        type: 0,
    }) {
        SocketIoClient.socket.send('message', message);
    }

    public static joinConversation({
        conversation_id,
    }: {
        conversation_id: number,
    }){        
        SocketIoClient.socket.emit('joinConversation', {
            conversation_id,
        });
    }

    public static getConversations() {
        console.log('front, Get my Conversation!');
        SocketIoClient.socket.emit('getConversations');
    }

    private static onSetConversations(args: any) {
        console.log('received converstions:', args);  
        SocketIoClient.chat.conversations.value = args.conversations;
        SocketIoClient.chat.conversations.value.forEach((conversation) => {
            SocketIoClient.joinConversation({
                conversation_id: conversation.id,
            });
        });
        SocketIoClient.chat.conversationLoaded.value = true;
        SocketIoClient.getMessages();
    }

    public static getMessages() {
        console.log('front, Get my Messages!');
        SocketIoClient.socket.emit('getMessages');
    }

    public static onSetMessages(args: any) {
        console.log('received Messages:', args);
        
        SocketIoClient.chat.cashMessages.value = args.messages;
    }

    public static searchByUser({
        user_name,
    }: {
        user_name: string,
    }) {
        console.log(SocketIoClient.socket   );        
        SocketIoClient.socket.emit('searchByUser', {
            user_name,
        });
    }

    public static onGetSearchResult(args) {
        console.log('got search results', args);
        SocketIoClient.search.users.value = args.users;
    }

    public static prepareVoiceMessage({
        length,
        filename,
        binary,
        conversation_id,
    }) {
        SocketIoClient.socket.emit('prepareVoiceMessage', {
            length,
            filename,
            binary,
            conversation_id,
        });
    }

    public static sendVoiceMessage({
        blob,
        num,
    }) {
        SocketIoClient.socket.emit('sendVoiceMessage', {
            binay: true,
            num: num,
            data: blob,
        });
    }

    public static onStartSendingVoiceMessage() {        
        if (!SocketIoClient.sendingBinaryData) {
            return;
        }
        SocketIoClient.sendingBinaryData.value = true;
    }

    public static sendPeer(data) {
        SocketIoClient.socket.emit('sendPeer', data);
    }
    
    public static onRecievePeer(args) {
        console.log('args:', args);
        
        if (args.type == 'offer') {
            SocketPeer.setPeer({
                offer: args
            });    
        } else if (args.type == 'answer') {
            SocketPeer.sendSignal(args);        
        }
    }
}