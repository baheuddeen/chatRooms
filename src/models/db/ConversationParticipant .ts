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

  async getConversationsParticipantByConvId(id: number): Promise<ConversationParticipantType[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conversation_participants WHERE conversation_id=$1';
      const users_id = await conn.query(sql, [id]);
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

  async create(newConversation: ConversationParticipantType): Promise<ConversationParticipant> {
    try {
        for (let key  of Object.keys(newConversation)){
            if (!newConversation[key]) {
                newConversation[key] = null;
            }
            if(newConversation[key] && typeof(newConversation[key]) == "string" && newConversation[key].includes("\'")) {
                newConversation[key] = newConversation[key].replace(/\'/g, "''");
            }
        }
      const conn = await client.connect();
      const sql = `INSERT INTO conversation_participants(conversation_id, user_id)
      VALUES ($1, $2) RETURNING *`;      
        
      const assets = await conn.query(sql, []);
      conn.release();      
      return assets.rows[0];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}

export type ConversationParticipantType ={
    [keyof: string]: any
    id: number,
    conversation_id : number, 
    user_id : number,
  }