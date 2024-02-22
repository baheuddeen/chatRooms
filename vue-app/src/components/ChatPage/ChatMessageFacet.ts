import { onMounted } from "vue";
import { Message } from "../../models/Types";
import User, { UserType } from "../../models/User";
import Services from "../../utilites/Services";
import Encryption from "../../utilites/Encryption";

export default class ChatMessage {
    public userNames: UserType[];
    
    public scrollMessagesY() {
        const messagesElem = document.querySelector('.messages');
        messagesElem.scroll({
            top: messagesElem.scrollHeight,
            behavior: 'smooth',
        })
    }


    setup(props: any, emit ) {        
        onMounted (() => {
            this.scrollMessagesY();
        });

        const { body, sender_id, nickName } = props.message as Message; 
        const decodedMessage = Encryption.textDecoder.decode(body);
        const isSender = User.getUser().id == sender_id ? true : false;
        const message = props.message;
        const conversation_id = props.conversation_id;

        const onStopOtherAudios = () => {            
            emit('stop-other-audios', props.message.filename.split('/').pop());
        }
               
        return {
            decodedMessage,
            sender_id,
            isSender,
            nickName,
            message,
            conversation_id,
            onStopOtherAudios,
        }
    }
}