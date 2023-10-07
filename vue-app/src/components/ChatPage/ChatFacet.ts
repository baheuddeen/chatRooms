import { Ref, ref, onMounted } from "vue";
import { io } from "socket.io-client";
import Services from "../../utilites/Services";
import { MenuItem } from "primevue/menuitem";
import SocketIoClient from "../../utilites/SocketIoClient";
import { Conversation, Message } from "../../models/Types";
import User from "../../models/User";


export default class ChatFacet {
    public readonly state: Ref<{connected: boolean}>;

    public readonly messages: Ref<Message[]>;

    public readonly conversations: Ref<Conversation[]>;

    public readonly activeConversationId: Ref<number>;

    public readonly conversationLoaded: Ref<boolean>;

    public message: Ref<string>;

    public cashMessages: Ref<{[key: number]: Message[]}>;

    public messageInput: Ref<HTMLInputElement>;

    constructor() {
        this.state = ref({
            connected: false
        });
        this.message = ref('');
        this.messages = ref([]);
        this.conversations = ref([]);
        this.activeConversationId = ref(null);
        this.cashMessages = ref({});
        this.conversationLoaded = ref(false);
        this.messageInput = ref(null);
    }

    public onKeydown(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            return;          
        }
        // update typing state
    }

    public async onsubmit() {  
        this.messageInput.value.focus();      
        if(!this.message.value || !this.activeConversationId.value) {
            return;
        }
        SocketIoClient.sendMessage({
            text: this.message.value,
            conversation_id: this.activeConversationId.value,
            type: 0,
        });
        this.message.value = ''
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
        for (const message of x) {
            const preparedMessage = await ChatFacet.prepareMessage(message);
            prepareMessages.push(preparedMessage);
        }                
        this.messages.value.push(...prepareMessages);
    }

    public static async prepareMessage(args: {
        sender_id: number,
        body: string,
        created: string,
        type: number,
        filename?: string,
    }) {
        let senderUser = User.users.find(user => user.id == args.sender_id);        
        if (!senderUser) {            
            senderUser = await Services.getUserById(args.sender_id);
            User.users.push(senderUser);
        }
        
        return ( {
                body: args.body?.replace(/''/g, '\''),
                sender_id: args.sender_id,
                nickName: senderUser.user_name,
                created: args.created,
                type: args.type,
                filename: args.filename,
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

    setup() {
        onMounted(() => {
            SocketIoClient.connect();
            this.getConversations();
        })

        return {
            message: this.message,
            messages: this.messages,
            conversations: this.conversations,
            state: this.state,
            activeConversationId: this.activeConversationId,
            conversationLoaded: this.conversationLoaded,
            messageInput: this.messageInput,
            onsubmit: this.onsubmit.bind(this),
            onKeydown: this.onKeydown.bind(this),
            onSelectConversation: this.onSelectConversation.bind(this),
            onStopOtherAudios: this.onStopOtherAudios.bind(this),
        };
    }
}

