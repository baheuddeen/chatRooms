import { onMounted } from "vue";
import { Message } from "../../models/Types";
import User, { UserType } from "../../models/User";
import Services from "../../utilites/Services";

export default class ChatMessage {
    public userNames: UserType[];
    
    public scrollMessagesY() {
        const messagesElem = document.querySelector('.messages');
        messagesElem.scroll({
            top: messagesElem.scrollHeight,
            behavior: 'smooth',
        })
    }

    setup(props: any) {        
        onMounted (() => {
            this.scrollMessagesY();
        });

        const { body, sender_id, nickName } = props.message as Message; 
        const isSender = User.getUser().id == sender_id ? true : false;
        
               
        return {
            body,
            sender_id,
            isSender,
            nickName,
        }
    }
}