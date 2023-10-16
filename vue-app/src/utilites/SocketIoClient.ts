import { io, Socket } from "socket.io-client";
import { Ref } from "vue";
import { Conversation, Message } from "../models/Types";
import User, { UserType } from "../models/User";
import Services from "./Services";
import ChatFacet from "../components/ChatPage/ChatFacet";
import SearchFacet from "../components/ChatPage/SearchFacet";
import SocketPeer from "./SocketPeer";
import Peer from 'simple-peer';
import VoiceCallFacet from "../components/ChatPage/VoiceCallFacet";

export default class SocketIoClient {
    public static socket: Socket ;
    private static chat: ChatFacet;
    private static search: SearchFacet;
    private static sendingBinaryData: Ref<boolean>;
    private static voiceCall: VoiceCallFacet;



    public static connect() {
        const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
        SocketIoClient.socket = io(URL);
        SocketIoClient.socket.on('otherDeviceIsLoggedIn', SocketIoClient.onOtherDeviceIsLoggedIn);
        SocketIoClient.socket.on("connect", SocketIoClient.onConnect);
        SocketIoClient.socket.on('disconnect', SocketIoClient.onDisConnect);
        SocketIoClient.socket.on('message', SocketIoClient.onMessage);
        SocketIoClient.socket.on('setConversation', SocketIoClient.onSetConversations);
        SocketIoClient.socket.on('setMessages', SocketIoClient.onSetMessages);
        SocketIoClient.socket.on('searchResult', SocketIoClient.onGetSearchResult);
        SocketIoClient.socket.on('startSendingTheVoiceMessage', SocketIoClient.onStartSendingVoiceMessage);
        SocketIoClient.socket.on('setConversationParticipant', SocketIoClient.onSetConversationParticipant);
        SocketIoClient.socket.on('peerToPeerOffer', SocketIoClient.onPeerToPeerOffer);
        SocketIoClient.socket.on('acceptVoiceCall', SocketIoClient.onAcceptVoiceCall);
        SocketIoClient.socket.on('setVoiceCallParticipants', SocketIoClient.setVoiceCallParticipants);
        SocketIoClient.socket.on('updateVoiceCallParticipants', SocketIoClient.onUpdateVoiceCallParticipants);
        // SocketIoClient.socket.on('recievePeer', SocketIoClient.onRecievePeer.bind(this));
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

    public static subscribeVoiceCall({
        voiceCall,
    }: {
        voiceCall:VoiceCallFacet,
    }) {
        SocketIoClient.voiceCall = voiceCall;
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
        SocketIoClient.getConversationParticipants();
        SocketIoClient.getVoiceCallParticipants();
    }

    public static getMessages() {
        console.log('front, Get my Messages!');
        SocketIoClient.socket.emit('getMessages');
    }

    public static onSetMessages(args: any) {
        console.log('received Messages:', args);
        
        SocketIoClient.chat.cashMessages.value = args.messages;
    }

    
    public static getConversationParticipants() {
        console.log('front get conversation participants');
        
        SocketIoClient.socket.emit('getConversationParticipant');
    }

    public static onSetConversationParticipant(args) {
        console.log('i recieved paricipants', args);        
        SocketIoClient.chat.cashConversationParticipant.value = args.conversation_participants ;
        // SocketIoClient.voiceCall.call(args)
    }

    public static getVoiceCallParticipants() {
        SocketIoClient.socket.emit('getVoiceCallParticipants');
    }

    public static setVoiceCallParticipants(args) {
        SocketIoClient.chat.cashVoiceChatParticipants.value = args.voice_calls_participants;
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

    public static joinVoiceCall({
        conversation_id,
    }) {
        SocketIoClient.socket.emit('joinVoiceCall', {
            conversation_id,
        });
    }

    public static onUpdateVoiceCallParticipants(args) {
        console.log('new users on voice chat', args.users);
        SocketIoClient.chat.cashVoiceChatParticipants.value[args.conversation_id] = args.users;

        if(SocketIoClient.voiceCall?.activeVoiceCallId?.value == args.conversation_id) {
            console.log(args);
            
            if (args.user.email === User.getUser().email) {
                switch (args.action) {
                    case 'join':
                        SocketIoClient.voiceCall.call({
                            users: args.users,
                            conversation_id: args.conversation_id,
                        });
                    break;
                    case 'leave':
                        // TODO
                    break;
                    default:
                        console.log('un impelemented action', args.action);
                    break;
                }
            }
        }
        
        if(SocketIoClient.chat.activeConversationId.value == args.conversation_id) {
            
            SocketIoClient.chat.voiceChatParticipants.value = args.users;
        }
    }

    public static leaveVoiceCall() {
        SocketIoClient.socket.emit('leaveVoiceCall');
    }

    public static requestVoiceCall({
        data,
        activeConversationId,
        secondPeerEmail,
    }){
        SocketIoClient.socket.emit('requestVoiceCall', {
            conversation_id: activeConversationId,
            data, 
            second_peer_email: secondPeerEmail,
        });  
    }

    public static onPeerToPeerOffer(args: {
        data,
        second_peer_email,
    }){
        SocketIoClient.voiceCall.answer(args);
    }

    public static acceptVoiceCall({
        data,
        activeConversationId,
        secondPeerEmail,
    }) {
        console.log('send to acceptVoiceCall', { 
            data,
            conversation_id: activeConversationId,
            second_peer_email: User.getUser().email,
        });
        
        SocketIoClient.socket.emit('acceptVoiceCall', { 
            data,
            conversation_id: activeConversationId,
            second_peer_email: secondPeerEmail,
        })
    }

    public static onAcceptVoiceCall(args) {
        
        SocketIoClient.voiceCall.socketPeers.forEach((socketPeer) => {
            console.log(socketPeer);
            
            if (socketPeer.secondPeerEmail == args.second_peer_email) {
                socketPeer.signal(args.data);
                console.log('connection should be made');

            }
        });
    }

    public static onOtherDeviceIsLoggedIn() {
        // TODO add more information.
        SocketIoClient.chat.otherDeviceIsLoggedIn.value = true;
    }
}