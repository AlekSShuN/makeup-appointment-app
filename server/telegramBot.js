import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Явно указываем путь к .env файлу
const envPath = path.join(__dirname, '.env');
console.log('🔧 Loading .env from:', envPath);

dotenv.config({ path: envPath });

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

console.log('🔧 Telegram config check:', {
    hasToken: !!token,
    hasChatId: !!chatId,
    tokenLength: token?.length,
    chatId: chatId,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('TELEGRAM'))
});

let bot;

if (token && chatId) {
    bot = new TelegramBot(token, { polling: false });
    console.log('✅ Telegram bot initialized');
} else {
    console.warn('⚠️ Telegram bot not configured - missing token or chat ID');
    console.warn('Current working directory:', process.cwd());
}

export const sendTelegramNotification = async (bookingData, service) => {
    console.log('🔧 sendTelegramNotification called with:', {
        hasBot: !!bot,
        hasChatId: !!chatId,
        bookingId: bookingData.bookingId
    });

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

        console.log('📤 Sending Telegram message to chat ID:', chatId);
        const result = await bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            disable_notification: false
        });

        console.log('✅ Telegram notification sent successfully, message ID:', result.message_id);
        return true;
    } catch (error) {
        console.error('❌ Error sending Telegram notification:', error.message);
        return false;
    }
};

// 2. Напоминание за день
export const sendReminder = async (booking) => {
    if (!bot || !chatId) {
        console.warn('Telegram bot not configured');
        return false;
    }

    try {
        const message = `
⏰ *НАПОМИНАНИЕ О ЗАПИСИ*

Завтра в ${booking.time} у вас запись!

*Клиент:* ${booking.client.name}
*Телефон:* ${booking.client.phone}
*Услуга:* ${booking.service?.name || 'Не указана'}
*ID записи:* ${booking.bookingId}
        `.trim();

        await bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            disable_notification: false
        });

        console.log('✅ Telegram reminder sent');
        return true;
    } catch (error) {
        console.error('❌ Error sending Telegram reminder:', error);
        return false;
    }
};

// 3. Отмена записи
export const sendCancellation = async (booking) => {
    if (!bot || !chatId) {
        console.warn('Telegram bot not configured');
        return false;
    }

    try {
        const message = `
❌ *ЗАПИСЬ ОТМЕНЕНА*

*Дата:* ${booking.date}
*Время:* ${booking.time}
*Клиент:* ${booking.client.name}
*Телефон:* ${booking.client.phone}
*Услуга:* ${booking.service?.name || 'Не указана'}
*ID записи:* ${booking.bookingId}
        `.trim();

        await bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            disable_notification: false
        });

        console.log('✅ Telegram cancellation sent');
        return true;
    } catch (error) {
        console.error('❌ Error sending Telegram cancellation:', error);
        return false;
    }
};

export default bot;