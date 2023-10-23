export type Conversation = {
    id? : number,
    conversation_participant: number, 
    title: string,
}

export type Message = {
    sender_id: number,
    body: ArrayBuffer,
    nickName?: string,
    created: string,
    type: number,
    filename?: string,
    is_encrypted: number,
}


export type ConversationType ={
    [keyof: string]: any
    id: number,
    conversation_id : number, 
    user_id : number,
  }