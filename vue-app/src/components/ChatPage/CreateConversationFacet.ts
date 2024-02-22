import { Ref, ref } from "vue";
import SocketIoClient from "../../utilites/SocketIoClient";

const conversationTypeEnum = {
    public: '1',
    private: '0',
}

export default class CreateConversationFacet {
    public title: Ref<string>;

    public inviteLink: Ref<string>;

    public converstionType: Ref<string>;

    public onCopy() {
        navigator.clipboard.writeText(this.inviteLink.value);
    }

    constructor() {
        this.title = ref('');
        this.inviteLink = ref('');
        this.converstionType = ref(conversationTypeEnum.public);
    }

    public onSubmit() {        
        if(!this.title.value) {
            return;
        }        

        SocketIoClient.createConversation({
            title: this.title.value,
            conversationType: this.converstionType.value,
        })
    }


    public setup() {
        return {
            title: this.title,
            onSubmit: this.onSubmit.bind(this),
            inviteLink: this.inviteLink,
            onCopy: this.onCopy.bind(this),
            conversationType: this.converstionType,
        };
    }
}