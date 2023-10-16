import client from '../../database.js';

export default class Conversation {
  // retrive all conversations
  // async index():Promise<Conversation[]> {
  //   try {
  //     const conn = await client.connect();
  //     const sql = 'SELECT * FROM conversations';
  //     const assets = await conn.query(sql);
  //     conn.release();      
  //     return assets.rows;
  //   } catch (err) {
  //     throw new Error(`Error: ${err}`);
  //   }
  // }

  // get conversation with id
  async show(id: number | string):Promise<ConversationType> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conversations WHERE id=($1)';
      const assets = await conn.query(sql, [id]);
      // const assets = await conn.query(sql, [id]);
      conn.release();
      if (!assets.rows[0]) throw Error(`no conversation with id = ${id}`);
      return assets.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async create(newConversation: ConversationType): Promise<ConversationType> {
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
      const sql = `INSERT INTO conversations(title, conversation_participants_id, created)
      VALUES ($1, $2, $3) RETURNING *`;      
        
      const assets = await conn.query(sql, [newConversation.title, 1, new Date(Date.now()).toISOString()]);
      conn.release();      
      return assets.rows[0];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}

export type ConversationType ={
    [keyof: string]: any
    id?: number | string,
    conversation_participant: number, 
    title: string,
  }