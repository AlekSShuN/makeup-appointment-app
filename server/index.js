import app from './app.js';
import dotenv from 'dotenv';
import { setupAdminBot } from './telegramBot.js';

dotenv.config();

const PORT = process.env.PORT || 5002;

console.log('🚀 Starting server with configuration:');
console.log('   PORT:', PORT);
console.log('   TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING');
console.log('   TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? 'SET' : 'MISSING');
console.log('   NODE_ENV:', process.env.NODE_ENV);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

setupAdminBot();