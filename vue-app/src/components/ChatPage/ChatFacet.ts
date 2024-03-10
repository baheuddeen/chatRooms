import { Ref, ref, onMounted, watch } from "vue";
import Services from "../../utilites/Services";
import SocketIoClient from "../../utilites/SocketIoClient";
import { Conversation, Message } from "../../models/Types";
import User, { UserType } from "../../models/User";
import Encryption from "../../utilites/Encryption";


export default class ChatFacet {
    public readonly otherDeviceIsLoggedIn: Ref<boolean>;

    public readonly state: Ref<{connected: boolean}>;

    public readonly messages: Ref<Message[]>;

    public readonly conversations: Ref<Conversation[]>;

    public readonly activeConversationId: Ref<number>;

    public readonly conversationLoaded: Ref<boolean>;

    public readonly messagesLoaded: Ref<boolean>;

    public message: Ref<string>;

    public cashMessages: Ref<{[key: number]: Message[]}>;

    public cashConversationParticipant: Ref<{[key: number]: UserType[]}>;

    public conversationParticipant: Ref<UserType[]>;

    public voiceChatParticipants: Ref<UserType[]>;

    public cashVoiceChatParticipants: Ref<{[key: number]: UserType[]}>

    public messageInput: Ref<HTMLInputElement>;

    public sampleRate: number;

    public waitForInput: any;

    public rows: Ref<number>;

    public rowHeight = 0;

    public trackScrollHeight = 0;

    public watchInputHeight: any;

    public desktopView: Ref<boolean>;

    public ConverstionParticipantVisible: Ref<boolean>;

    public isTyping: Ref<boolean>;

    constructor() {
        this.state = ref({
            connected: false,
        });
        this.otherDeviceIsLoggedIn = ref(false);
        this.rows = ref(1);
        this.message = ref('');
        this.messages = ref([]);
        this.conversations = ref([]);
        this.activeConversationId = ref(null);
        this.cashMessages = ref({});
        this.messagesLoaded = ref(false);
        this.cashConversationParticipant = ref({});
        this.conversationParticipant = ref([]);
        this.conversationLoaded = ref(false);
        this.messageInput = ref(null);
        this.sampleRate = 44100; // default sampleRate
        this.voiceChatParticipants = ref([]);
        this.cashVoiceChatParticipants = ref({});
        const audioContext = new AudioContext();
        this.desktopView = ref(window.innerWidth > 768);
        this.ConverstionParticipantVisible = ref(false);
        this.isTyping = ref(false);
        if (audioContext.sampleRate) {
            this.sampleRate = audioContext.sampleRate;
        }
    }

    public watchMessageInputHeight(x: any) {
        if (!this.rowHeight) {
            this.rowHeight = this.messageInput.value.getBoundingClientRect().height;
        }
        this.messageInput.value.style.height = 'auto';
        const futureHeight = this.messageInput.value.scrollHeight;
        if (futureHeight > this.rowHeight * 4) {
            this.messageInput.value.style.height =  this.rowHeight * 4 + 'px';
            this.messageInput.value.style.overflowY = 'scroll';
            clearInterval(this.watchInputHeight);
            this.watchInputHeight = null;
            return;
        }
        this.messageInput.value.style.height = this.messageInput.value.scrollHeight + 'px';
        if ( this.messageInput.value.scrollHeight == this.messageInput.value.getBoundingClientRect().height) {
            clearInterval(this.watchInputHeight);
            this.watchInputHeight = null;
        }
    }

    


    public onKeydown(event: KeyboardEvent) {   
        if (event.key == 'Enter' && window.innerWidth > 768 && !event.shiftKey) {
            event.preventDefault();
            this.onsubmit();       
            this.message.value = '';
            this.isTyping.value = false;
            this.messageInput.value.value = '';       
        }
        if (this.messageInput.value.value) {
            this.isTyping.value = true;
        } else {
            this.isTyping.value = false;
        }
        if (!this.watchInputHeight) {
            this.watchInputHeight = setInterval(this.watchMessageInputHeight.bind(this), 10);            
        }
    }

    public async onsubmit() {  
        this.messageInput.value.focus();      
        if(!this.message.value || !this.activeConversationId.value) {
            return;
        }
        if (!this.watchInputHeight) {
            this.watchInputHeight = setInterval(this.watchMessageInputHeight.bind(this), 10);            
        }
        
        SocketIoClient.sendMessage({
            text: this.message.value,
            conversation_id: this.activeConversationId.value,
            type: 0,
            is_encrypted: 1,
        });
        this.message.value = '';
        this.isTyping.value = false;
        this.messageInput.value.value = '';        
        return true;
    }

    async getConversations(): Promise<void> {
        SocketIoClient.getConversations();
    }

    public joinConversation(conversation_id: number) {
        SocketIoClient.joinConversation({
            conversation_id,
        });
    }

    public async onSelectConversation(event: MouseEvent) {
        const target = event.target as HTMLElement;        
        const conversationId = parseInt(target.getAttribute('data-conversation-id'), 10);
        console.log(conversationId);
        
        if(this.activeConversationId.value == conversationId) {
            return;
        }
        this.activeConversationId.value = conversationId;
        if(!this.conversations.value.find(conversation => conversation.id == this.activeConversationId.value)) {
            SocketIoClient.joinConversation({
                conversation_id: this.activeConversationId.value
            });
        }
        // i want to have messages cash!
        if (!this.cashMessages.value[this.activeConversationId.value]){
            console.log('no cahsed messages!');      
            return;
        }        
        console.log(this.cashMessages.value);
        
        const x = this.cashMessages.value[this.activeConversationId.value];
        const prepareMessages = [];
        this.messages.value = [];
        console.log('it will sort messages!');
        for (const message of x) {
            const preparedMessage = await ChatFacet.prepareMessage(message);
            prepareMessages.push(preparedMessage);
        }         
        prepareMessages.sort((a, b) => {            
            return new Date(a.created).getTime() - new Date(b.created).getTime();
        });       
        this.messages.value.push(...prepareMessages);

        if (!this.cashConversationParticipant.value[this.activeConversationId.value]){
            console.log('no participant! something went wrong for sure!');      
            return;
        }   

        // set conversation participants
        this.conversationParticipant.value = this.cashConversationParticipant.value[this.activeConversationId.value];

        // set voice chat participants
        this.voiceChatParticipants.value = this.cashVoiceChatParticipants.value[this.activeConversationId.value];
        // updates 
    }

    public static async prepareMessage(args: {
        sender_id: number,
        body: ArrayBuffer,
        created: string,
        type: number,
        filename?: string,
        is_encrypted: number,
        receiver_id?: number,
        iv?: ArrayBuffer,
        symmetric_key?: ArrayBuffer,
    }) {
        let senderUser = User.users.find(user => user.id == args.sender_id);        
        if (!senderUser) {            
            senderUser = await Services.getUserById(args.sender_id);
            User.users.push(senderUser);
        }
        let body = args.body;
        if (args.is_encrypted == 1 && args.type == 0) {
            try{
                body = await Encryption.decryptMessage(args.body);
            } catch (err) {
                console.log('wrong key!');
            }
        }        
        return ( {
                body,
                sender_id: args.sender_id,
                nickName: senderUser.user_name,
                created: args.created,
                type: args.type,
                filename: args.filename,
                is_encrypted: args.is_encrypted,
                receiver_id: args.receiver_id,
                iv: args.iv,
                symmetric_key: args.symmetric_key
            }
        )
    }

    public onStopOtherAudios(args) {
        console.log('wow', args, 'do something!');
        // TODO FIX IT 
        document.querySelectorAll('audio').forEach((audio: HTMLAudioElement) => {
            if (audio.id != args) {
                console.log('wow', args, 'do onother something!');
                (audio.parentElement?.querySelector('.ar-player-actions .ar-player__play--active') as HTMLDivElement)?.click();
                console.log('wow', args, 'do the thing!', audio.parentElement?.querySelector('.ar-player-actions'));

            }
        });
    }

    public watchWindowSize() {
        window.addEventListener('resize', () => {
            this.desktopView.value = window.innerWidth > 1200;
        });
    }

    setup() {
        onMounted(() => {
            SocketIoClient.connect();
            this.getConversations();
        });

        this.watchWindowSize();

        // get your crypto keys!
        Encryption.getCryptoKeyPair();


        return {
            message: this.message,
            messages: this.messages,
            rows: this.rows,
            conversations: this.conversations,
            state: this.state,
            activeConversationId: this.activeConversationId,
            conversationLoaded: this.conversationLoaded,
            messageInput: this.messageInput,
            sampleRate: this.sampleRate,
            otherDeviceIsLoggedIn: this.otherDeviceIsLoggedIn,
            cashConversationParticipant: this.cashConversationParticipant,
            conversationParticipant: this.conversationParticipant,
            voiceChatParticipants: this.voiceChatParticipants,
            messagesLoaded: this.messagesLoaded,
            desktopView: this.desktopView,
            ConverstionParticipantVisible: this.ConverstionParticipantVisible,
            isTyping: this.isTyping,
            onsubmit: this.onsubmit.bind(this),
            onKeydown: this.onKeydown.bind(this),
            onSelectConversation: this.onSelectConversation.bind(this),
            onStopOtherAudios: this.onStopOtherAudios.bind(this),
        };
    }
}

