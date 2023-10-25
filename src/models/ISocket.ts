import { Socket } from "socket.io";
import { UserType } from "./db/User";
import { ConversationType } from "./db/Conversation";

export default interface ISocket extends Socket{
    user_data?: UserType;
    conversations?: ConversationType[];
    voiceMessage?: {
        length: number,
        filename: string,
        binary: boolean,
        conversation_id: string, 
        iv: ArrayBuffer,
        symmetric_keys: [
            {
                receiver_id: number,
                symmetric_key: ArrayBuffer,
            }
        ]
    };
    activeVoiceCallId?: number;
}