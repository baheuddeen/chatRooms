import { Socket } from "socket.io";
import { UserType } from "./db/User";
import { ConversationType } from "./db/Conversation";

export default interface ISocket extends Socket{
    user_data?: UserType;
    conversations?: ConversationType[];
}