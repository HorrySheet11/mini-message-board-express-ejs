import mysql from 'mysql2';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'odin',
  database: 'mini_message_board',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

const [result] = await pool.query('Select * from messages');
console.log(result);
