import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'onboardbeta';

async function createDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: false
    });

    // Use backticks to safely wrap DB name (avoid SQL injection by not interpolating unsanitized user input in production)
    const createSql = `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`;
    await connection.query(createSql);
    console.log(`Database "${DB_NAME}" is ready (created or already exists).`);
  } catch (err) {
    console.error('Failed to create database:', err.message || err);
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end().catch(()=>{});
  }
}

createDatabase();

