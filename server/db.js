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
    const hashedPassword = bcrypt.hashSync('DUBova1994', 12);

    const insertAdmin = db.prepare(`
      INSERT OR IGNORE INTO admins (username, password_hash) 
      VALUES (?, ?)
    `);

    const result = insertAdmin.run('admin', hashedPassword);

    if (result.changes > 0) {
      console.log('✅ Создан администратор по умолчанию: admin / admin123');
    } else {
      console.log('ℹ️  Администратор уже существует');

      const updateAdmin = db.prepare(`
        UPDATE admins SET password_hash = ? WHERE username = ?
      `);
      const updateResult = updateAdmin.run(hashedPassword, 'admin');

      if (updateResult.changes > 0) {
        console.log('🔒 Пароль администратора обновлен с хешированием');
      }

      const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
      console.log('📋 Existing admin:', {
        username: admin.username,
        password_hash: admin.password_hash.substring(0, 20) + '...',
        role: admin.role
      });
    }
  } catch (error) {
    console.error('❌ Ошибка при создании администратора:', error);
  }
}

createDefaultAdmin();

export default db;