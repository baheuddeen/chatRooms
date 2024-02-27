import bcrypt from 'bcrypt';
import client from '../../database.js';

export default class User {
  // retrive all user
  async index():Promise<UserType[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const assets = await conn.query(sql);
      conn.release();      
      return assets.rows;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  // get user with id
  async show(id: number):Promise<UserType> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT user_name, email, id, public_key FROM users WHERE id=($1)';
      const assets = await conn.query(sql, [id]);
      conn.release();
      if (!assets.rows[0]) throw Error(`no User with id = ${id}`);
      return assets.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async updatePublicKey({
    id,
    public_key,
  }){
    try {
      const conn = await client.connect();
      const sql = 'UPDATE users SET public_key = $1 WHERE id = $2';
      const assets = await conn.query(sql, [public_key, id]);
      conn.release();
      if (!assets.rows[0]) console.log(`no User with id = ${id}`);
      return assets.rows[0];
    } catch (err) {
      console.log(`${err}`);
    }
  }

  async create(newUser: UserType): Promise<UserType> {
    try {
      for (let key  of Object.keys(newUser)){
          if (!newUser[key]) {
              newUser[key] = null;
          }
          if(newUser[key] && typeof(newUser[key]) == "string" && newUser[key].includes("\'")) {
              newUser[key] = newUser[key].replace(/\'/g, "''");
          }
      }
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(newUser.password, salt);
      const conn = await client.connect();
      const sql = `INSERT INTO users(email, password, user_name, public_key, verification_code)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;      
      const assets = await conn.query(sql, [newUser.email, password, newUser.user_name, newUser.public_key, newUser.verification_code]);
      conn.release();      
      return assets.rows[0];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  public async check(user: UserType): Promise <UserType> {
    console.log(user);
    
    try {
      const conn = await client.connect();
      const sql = 'SELECT id, user_name, email FROM users WHERE id=($1)';
      console.log(user.id);
      
      const assets = await conn.query(sql, [user.id]);
      conn.release();
      if (!assets.rows[0]) throw Error(`no User with id = ${user.id}`);
      return assets.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getUserByEmail(email: string): Promise<UserType> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE email=($1)';
      const users = await conn.query(sql, [email]);
      conn.release(); 
      if (users.rowCount == 0) { 
        console.log(sql);
        
        console.log('this email is not exist');
               
        throw new Error('this email is not exist');
      }
      return users.rows[0];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  
  async getByUserName(user_name: string): Promise<UserType[]> {
    try {
      user_name = `%${user_name}%`;
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE user_name like $1';
      console.log(sql, user_name);
      
      const users = await conn.query(sql, [user_name]);
      conn.release(); 
      return users.rows;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async verifyUser(email: string): Promise<UserType> {    
    try {
      const conn = await client.connect();
      const sql = 'UPDATE users SET verified = 1 WHERE email = $1 RETURNING *';      
      const users = await conn.query(sql, [email]);
      conn.release(); 
      return users.rows[0];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}



export type UserType = {
  [keyof: string]: any
  id: number,
  user_name: string,
  email: string,
  password: string,
  verified: number,
  public_key: string,
  verification_code: string,
}