// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config({
//   path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
// });

// const db = await mysql.createPool({
//   host: 'mysql-310262b9-fujisyousuke-b8cb.i.aivencloud.com',
//   user: 'avnadmin',
//   password: 'AVNS__G8gkwjlZcM9kTe4BcH',
//   database: 'db',
//   port: 28249,
//   connectionLimit: 100,
// });

// export default db;

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

const db = await mysql.createPool({
  host: 'database-ktpm-sis-d59d.l.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_0IMvRU7qgcNDJHnsV2T',
  database: 'db',
  port: 25640,
  connectionLimit: 100,
});

export default db;