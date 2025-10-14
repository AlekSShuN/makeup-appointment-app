import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_CHAT_ID;

console.log('🔧 Telegram bot configuration check:', {
    hasToken: !!token,
    tokenLength: token?.length,
    hasChatId: !!adminChatId,
    chatId: adminChatId
});

export const sendTelegramNotification = async (bookingData, service) => {
    // ✅ ПРАВИЛЬНАЯ ПРОВЕРКА КОНФИГУРАЦИИ
    if (!token || !adminChatId) {
        console.log('❌ Telegram bot not configured - missing token or chat ID');
        console.log('   Token:', token ? 'SET' : 'MISSING');
        console.log('   Chat ID:', adminChatId ? 'SET' : 'MISSING');
        return;
    }

    // ✅ ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА ФОРМАТА ТОКЕНА
    if (!token.includes(':')) {
        console.log('❌ Invalid Telegram token format');
        return;
    }

    try {
        const bot = new TelegramBot(token);

        const message = `
🎉 Новая запись!

Услуга: ${service?.title || 'Не указана'}
Дата: ${bookingData.date}
Время: ${bookingData.time}

Клиент:
Имя: ${bookingData.client.name}
Телефон: ${bookingData.client.phone}
${bookingData.client.comment ? `Комментарий: ${bookingData.client.comment}` : ''}

ID записи: ${bookingData.bookingId}
        `;

        console.log('📤 Attempting to send Telegram message...');
        console.log('   To chat ID:', adminChatId);
        console.log('   Message length:', message.length);

        await bot.sendMessage(adminChatId, message);
        console.log('✅ Telegram notification sent successfully!');

    } catch (error) {
        console.error('❌ Failed to send Telegram notification:', error.message);

        // ✅ ПОДРОБНАЯ ДИАГНОСТИКА ОШИБОК
        if (error.response?.body) {
            const errorBody = error.response.body;
            console.error('📋 Telegram API error:', {
                description: errorBody.description,
                error_code: errorBody.error_code
            });

            // Частые ошибки и их решения
            if (errorBody.error_code === 401) {
                console.error('💡 Solution: Check if Telegram token is correct');
            } else if (errorBody.error_code === 400) {
                console.error('💡 Solution: Check if chat ID is correct and bot was started with /start');
            } else if (errorBody.error_code === 403) {
                console.error('💡 Solution: User blocked the bot');
            }
        }
    }
};

// ✅ УПРОЩЕННАЯ ВЕРСИЯ БОТА ДЛЯ КОМАНД
export const setupAdminBot = () => {
    if (!token || !adminChatId) {
        console.log('❌ Telegram bot not configured - skipping bot setup');
        return;
    }

    try {
        const bot = new TelegramBot(token, { polling: true });
        console.log('✅ Telegram bot started with commands support');

        bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id.toString();

            if (chatId !== adminChatId) {
                bot.sendMessage(chatId, '❌ Этот бот только для администратора.');
                console.log(`🚫 Unauthorized access attempt from: ${chatId}`);
                return;
            }

            bot.sendMessage(chatId, '👋 Бот уведомлений запущен! Вы будете получать уведомления о новых записях.');
            console.log(`✅ Admin started the bot: ${chatId}`);
        });

        bot.on('polling_error', (error) => {
            console.error('❌ Telegram polling error:', error.message);
        });

    } catch (error) {
        console.error('❌ Failed to setup Telegram bot:', error.message);
    }
};