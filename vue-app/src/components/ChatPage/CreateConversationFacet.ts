import { Ref, ref } from "vue";
import SocketIoClient from "../../utilites/SocketIoClient";

export default class CreateConversationFacet {
    public title: Ref<string>;

    public inviteLink: Ref<string>;

    constructor() {
        this.title = ref('');
        this.inviteLink = ref('');
    }

    public onSubmit() {
        console.log('hmmm');
        
        if(!this.title.value) {
            return;
        }
        console.log(this.title.value);
        

        SocketIoClient.createConversation({
            title: this.title.value,
        })
    }


    public setup() {
        return {
            title: this.title,
            onSubmit: this.onSubmit.bind(this),
            inviteLink: this.inviteLink,
        };
    }
}