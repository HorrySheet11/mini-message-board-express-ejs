const dotenv = require('dotenv');
const mysql = require('mysql2');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

async function getMessages(){
  const [result] = await pool.query('Select * from messages');
  return result;
}

async function getMessage(id){
  const [result] = await pool.query(`Select * from messages where id = ?`, [id]);
  return result[0];
}

async function createMessage(user, text){
  const [result] = await pool.query(`Insert into messages (sender, message) values (?, ?)`, [user, text]);
  const id = result.insertId;
  return getMessage(id);
}

// const messages = await getMessages();
// const message = await getMessage(2);
// const newMessage = await createMessage('Maya', 'Eeuuuuughexport ');
// console.log(messages);

module.exports = { getMessages, getMessage, createMessage };
