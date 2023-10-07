export type Conversation = {
    id? : number,
    conversation_participant: number, 
    title: string,
}

export type Message = {
    sender_id: number,
    body: string,
    nickName?: string,
    created: string,
    type: number,
    filename?: string,
}


export type ConversationType ={
    [keyof: string]: any
    id: number,
    conversation_id : number, 
    user_id : number,
  }