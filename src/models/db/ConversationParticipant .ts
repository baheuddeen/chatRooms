import client from '../../database.js';

export default class ConversationParticipant {
  // get conversation with id
  async show(id: number):Promise<ConversationParticipantType> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conversation_participants WHERE id=($1)';
      const assets = await conn.query(sql, [id]);
      conn.release();
      if (!assets.rows[0]) throw Error(`no conversation with id = ${id}`);
      return assets.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getConversationsParticipantByConvId(ids: (string | number)[]): Promise<ConversationParticipantType[]> {
    const  conversationIds = ids.join(', ');
    try {
      const conn = await client.connect();
      const sql = `SELECT users.user_name, users.email, conversation_participants.conversation_id FROM conversation_participants
        INNER JOIN users on conversation_participants.user_id = users.id
        WHERE conversation_id in (${conversationIds})`;
      const users_id = await conn.query(sql);
      conn.release();
      // if (!conversations.rows[0]) throw Error(`no conversation with id = ${id}`);
      return users_id.rows;
    } catch (err) {
      throw new Error(`${err}`); 
    }
  }

  async getConversationsByUserId(id: number):Promise<ConversationParticipantType[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conversation_participants WHERE user_id=$1';
      const conversations = await conn.query(sql, [id]);
      conn.release();
      // if (!conversations.rows[0]) throw Error(`no conversation with id = ${id}`);
      return conversations.rows;
    } catch (err) {
      throw new Error(`${err}`); 
    }
  }

  async create(newConversationParticipant: ConversationParticipantType): Promise<ConversationParticipant> {
    try {
        for (let key  of Object.keys(newConversationParticipant)){
            if (!newConversationParticipant[key]) {
              newConversationParticipant[key] = null;
            }
            if(newConversationParticipant[key] && typeof(newConversationParticipant[key]) == "string" && newConversationParticipant[key].includes("\'")) {
              newConversationParticipant[key] = newConversationParticipant[key].replace(/\'/g, "''");
            }
        }
      const conn = await client.connect();
      const sql = `INSERT INTO conversation_participants(conversation_id, user_id)
      VALUES ($1, $2) RETURNING *`;      
        
      const assets = await conn.query(sql, [newConversationParticipant.conversation_id, newConversationParticipant.user_id]);
      conn.release();      
      return assets.rows[0];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}

export type ConversationParticipantType ={
    [keyof: string]: any
    id?: number,
    conversation_id : number | string, 
    user_id : number | string,
  }