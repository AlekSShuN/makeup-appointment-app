import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env из папки server
const envPath = path.join(__dirname, '.env');
console.log('🔧 Loading .env from:', envPath);

dotenv.config({ path: envPath });

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

console.log('🔧 Telegram config check:', {
    hasToken: !!token,
    hasChatId: !!chatId,
    tokenLength: token?.length,
    chatId: chatId
});

let bot;

if (token && chatId) {
    bot = new TelegramBot(token, { polling: false });
    console.log('✅ Telegram bot initialized');
} else {
    console.warn('⚠️ Telegram bot not configured - missing token or chat ID');
}

export const sendTelegramNotification = async (bookingData, service) => {
    if (!bot || !chatId) {
        console.warn('❌ Telegram bot not configured - cannot send notification');
        return false;
    }

    try {
        const message = `
🎉 *НОВАЯ ЗАПИСЬ*

*Услуга:* ${service?.name || 'Не указана'}
*Цена:* ${service?.price || 'Не указана'} руб.
*Длительность:* ${service?.duration || 'Не указана'} мин.

*Дата:* ${bookingData.date}
*Время:* ${bookingData.time}

*Клиент:*
👤 ${bookingData.client.name}
📞 ${bookingData.client.phone}
${bookingData.client.comment ? `💬 ${bookingData.client.comment}` : ''}

*ID записи:* ${bookingData.bookingId}
        `.trim();

        await bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            disable_notification: false
        });

        console.log('✅ Telegram notification sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Error sending Telegram notification:', error);
        return false;
    }
};

export default bot;