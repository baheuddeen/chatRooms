import { Request } from "express"
import { UserType } from "./db/User"

export default interface IRequest extends Request{
    user_data?: UserType;
}