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

  async getMessagesByConversationId(id: number | string, receiver_id: number | string):Promise<Message[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conversation_messages WHERE conversation_id=($1) AND receiver_id in (0, $2)';
      const assets = await conn.query(sql, [id, receiver_id]);
      conn.release();
      return assets.rows;
    } catch (err) {
      throw new Error(`${err}`);
    } 
  }

  async create(newmessage: messageType): Promise<void> {    
    try {
        for (let key  of Object.keys(newmessage)){
            if (!newmessage[key] && newmessage[key] != 0) {
                newmessage[key] = null;
            }
            if(newmessage[key] && typeof(newmessage[key]) == "string" && newmessage[key].includes("\'")) {
                newmessage[key] = newmessage[key].replace(/\'/g, "''");
            }
        }
      const conn = await client.connect();
      const sql = `INSERT INTO conversation_messages(conversation_id, sender_id, body, created, type, filename, is_encrypted, receiver_id, iv, symmetric_key)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;      
      console.log(newmessage, 'hey');
      
      const assets = await conn.query(sql, [
        newmessage.conversation_id,
        newmessage.sender_id,
        newmessage.body,
        newmessage.created,
        newmessage.type,
        newmessage.filename,
        newmessage.is_encrypted,
        newmessage.receiver_id,
        newmessage.iv ? newmessage.iv : new ArrayBuffer(0),
        newmessage.symmetric_key ? newmessage.symmetric_key : new ArrayBuffer(0),
      ]);
      conn.release();      
      // return assets.rows[0];
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }
}

export type messageType ={
    [keyof: string]: any
    id?: number,
    conversation_id: number,
    sender_id: number,
    receiver_id?: number,
    body: string,
    created: string,
    type: number,
    is_encrypted: number,
    iv?: ArrayBuffer,
    symmetric_key: ArrayBuffer,
  }