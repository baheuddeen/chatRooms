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
import CreateConversationFacet from "../components/ChatPage/CreateConversationFacet";
import Encryption from "./Encryption";

export default class SocketIoClient {
    public static socket: Socket ;
    private static chat: ChatFacet;
    private static search: SearchFacet;
    private static sendingBinaryData: Ref<boolean>;
    private static voiceCall: VoiceCallFacet;
    private static createConversationFacet: CreateConversationFacet;



    public static connect(listenToEvents: boolean = true) {
        if (!SocketIoClient.socket) {
            const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
            SocketIoClient.socket = io(URL);   
        }
        if (!listenToEvents) {
            return;
        }
        SocketIoClient.socket.on('otherDeviceIsLoggedIn', SocketIoClient.onOtherDeviceIsLoggedIn);
        SocketIoClient.socket.on("connect", SocketIoClient.onConnect);
        SocketIoClient.socket.on('disconnect', SocketIoClient.onDisConnect);
        SocketIoClient.socket.on('message', SocketIoClient.onMessage);
        SocketIoClient.socket.on('setConversation', SocketIoClient.onSetConversations);
        SocketIoClient.socket.on('setMessages', SocketIoClient.onSetMessages);
        SocketIoClient.socket.on('searchResult', SocketIoClient.onGetSearchResult);
        SocketIoClient.socket.on('startSendingTheVoiceMessage', SocketIoClient.onStartSendingVoiceMessage);
        SocketIoClient.socket.on('setConversationParticipant', SocketIoClient.onSetConversationParticipant);
        SocketIoClient.socket.on('answerVoiceCall', SocketIoClient.onAnswerVoiceCall);
        SocketIoClient.socket.on('setVoiceCallParticipants', SocketIoClient.setVoiceCallParticipants);
        SocketIoClient.socket.on('updateVoiceCallParticipants', SocketIoClient.onUpdateVoiceCallParticipants);
        SocketIoClient.socket.on('conversationCreated', SocketIoClient.onConversationCreated);
        SocketIoClient.socket.on('changeStatus', SocketIoClient.onChangeStatus);
        // SocketIoClient.socket.on('recievePeer', SocketIoClient.onRecievePeer.bind(this));
    }

    public static subscribeChat({
        chat,
    }: { 
        chat: ChatFacet
    }) {
        SocketIoClient.chat = chat;
    }

    public static subcribeCreateConversationFacet({
        createConversationFacet,
    }){
        this.createConversationFacet = createConversationFacet;
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

    private static async onMessage (args: any) {
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

    public static async sendMessage(message: {
        text: string,
        conversation_id: number,
        type: 0,
        is_encrypted: number,
    }) {
        for (let user of SocketIoClient.chat.cashConversationParticipant.value[message.conversation_id]) {
            
            try {
                console.log('sent!', user);

                const public_key = await Encryption.importKey(user.public_key);
                SocketIoClient.socket.send('message', {
                    text: await Encryption.encryptMessage(message.text, public_key),
                    conversation_id: message.conversation_id,
                    type: 0,
                    is_encrypted: 1,
                    receiver_id: user.id,
                });

            } catch(err) {
                console.log(err);
                
            }
        }

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
        SocketIoClient.chat.cashMessages.value = args.messages;
        SocketIoClient.chat.messagesLoaded.value = true;
    }

    
    public static getConversationParticipants() {
        console.log('front get conversation participants');
        SocketIoClient.socket.emit('getConversationParticipant');
    }

    public static onSetConversationParticipant(args) {
        SocketIoClient.chat.cashConversationParticipant.value = args.conversation_participants ;
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
        SocketIoClient.socket.emit('searchByUser', {
            user_name,
        });
    }

    public static onGetSearchResult(args) {
        SocketIoClient.search.users.value = args.users;
    }

    public static async prepareVoiceMessage({
        length,
        filename,
        binary,
        conversation_id,
        iv,
        symmetric_key,
    }) {
        const symmetric_keys = [];
        for (let user of SocketIoClient.chat.cashConversationParticipant.value[conversation_id]) {
            const userPublicKey = await Encryption.importKey(user.public_key);
            const key = await Encryption.encryptSymmetricKey(symmetric_key, userPublicKey);
            try {
                symmetric_keys.push({
                    receiver_id: user.id,
                    symmetric_key: key,
                })
             } catch(err) {
                console.log(err);  
            }
        }
        SocketIoClient.socket.emit('prepareVoiceMessage', {
            length,
            filename,
            binary,
            conversation_id,
            iv,
            symmetric_keys,
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
            
            if (args.user.email === User.getUser().email && args.action == 'join') {  
                SocketIoClient.voiceCall.call({
                    conversation_id: args.conversation_id,
                });
            }
        }

        if (args.action == 'leave') {  
            console.log('delete a stream', args);
            
            SocketIoClient.voiceCall.removeStream({
                streamId: args.stream_id,
            })
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
    }){
        SocketIoClient.socket.emit('requestVoiceCall', {
            conversation_id: activeConversationId,
            data, 
        });  
    }

    public static onAnswerVoiceCall({
        data,
    }){
        console.log(SocketIoClient.voiceCall.socketPeer);
        
        SocketIoClient.voiceCall.socketPeer.peer.signal(data); 
    }

    public static onOtherDeviceIsLoggedIn() {
        // TODO add more information.
        SocketIoClient.chat.otherDeviceIsLoggedIn.value = true;
    }


    public static createConversation({
        title,
        conversationType,
    }) {
        console.log('it should create a room', title);
        console.log('type', conversationType);
        
        SocketIoClient.socket.emit('createConversation', {
            title,
            conversation_type: conversationType,
        });
    }

    public static onConversationCreated(args) {
        SocketIoClient.createConversationFacet.inviteLink.value = args.inviteLink;
    }

    public static updatePublicKey({
        id,
        public_key,
    }) {
        console.log('it should update the public key', {
            id,
            public_key,
        });
        
        SocketIoClient.socket.emit("updatePublicKey", {
            id,
            public_key,
        });
    }

    public static onChangeStatus(args: {
        user: UserType,
        conversation_id: number | string,
    }) {
        // update Cash Conversation Participant
        const convPartis = SocketIoClient.chat.cashConversationParticipant.value[args.conversation_id] as UserType[];
        
        const user = convPartis.find((user) => user.id == args.user.id);
        if (!user) {
            convPartis.push(args.user);
            return;
        }
        user.status = args.user.status;
    }

}