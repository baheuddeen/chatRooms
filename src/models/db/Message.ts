import client from '../../database.js';

export default class Message {
  // retrive all users
  async index():Promise<Message[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM messages';
      const assets = await conn.query(sql);
      conn.release();      
      return assets.rows;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  // get user with id
  async show(id: number):Promise<Message> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM messages WHERE id=($1)';
      const assets = await conn.query(sql, [id]);
      conn.release();
      if (!assets.rows[0]) throw Error(`no message with id = ${id}`);
      return assets.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getMessagesByConversationId(id: number):Promise<Message[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conversation_messages WHERE conversation_id=($1)';
      const assets = await conn.query(sql, [id]);
      conn.release();
      return assets.rows;
    } catch (err) {
      throw new Error(`${err}`);
    } 
  }

  async create(newmessage: messageType): Promise<void> {
    try {
        for (let key  of Object.keys(newmessage)){
            if (!newmessage[key]) {
                newmessage[key] = null;
            }
            if(newmessage[key] && typeof(newmessage[key]) == "string" && newmessage[key].includes("\'")) {
                newmessage[key] = newmessage[key].replace(/\'/g, "''");
            }
        }
      const conn = await client.connect();
      const sql = `INSERT INTO conversation_messages(conversation_id, sender_id, body, created)
      VALUES ($1, $2, $3, $4) RETURNING *`;      
      console.log(newmessage, 'hey');
      
      const assets = await conn.query(sql, [newmessage.conversation_id, newmessage.sender_id, newmessage.body, newmessage.created]);
      conn.release();      
      // return assets.rows[0];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}

export type messageType ={
    [keyof: string]: any
    id?: number,
    conversation_id: number,
    sender_id: number,
    body: string,
    created: string,
  }