import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'database.db');

const db = new Database(dbPath);

//Таблица бронирований
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

//Таблица администраторов
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function createDefaultAdmin() {
  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      console.log('⚠️  ADMIN_PASSWORD not set in environment variables');
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const insertAdmin = db.prepare(`
      INSERT OR IGNORE INTO admins (username, password_hash) 
      VALUES (?, ?)
    `);

    const result = insertAdmin.run(username, hashedPassword);

    if (result.changes > 0) {
      console.log(`✅ Создан администратор по умолчанию: ${username}`);
    } else {
      console.log(`ℹ️  Администратор ${username} уже существует`);
    }
  } catch (error) {
    console.error('❌ Ошибка при создании администратора:', error);
  }
}

createDefaultAdmin();

export default db;