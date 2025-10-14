import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_CHAT_ID;

// Экземпляр бота
const bot = new Telegraf(token);

console.log('🔧 Telegram bot configuration check:', {
    hasToken: !!token,
    tokenLength: token?.length,
    hasChatId: !!adminChatId,
    chatId: adminChatId
});

export const sendTelegramNotification = async (bookingData, service) => {
    if (!token || !adminChatId) {
        console.log('❌ Telegram bot not configured - missing token or chat ID');
        console.log('   Token:', token ? 'SET' : 'MISSING');
        console.log('   Chat ID:', adminChatId ? 'SET' : 'MISSING');
        return;
    }

    try {
        const message = `
🎉 Новая запись!

Услуга: ${service?.name || 'Не указана'}
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

        await bot.telegram.sendMessage(adminChatId, message);
        console.log('✅ Telegram notification sent successfully!');

    } catch (error) {
        console.error('❌ Failed to send Telegram notification:', error.message);

        if (error.response) {
            console.error('📋 Telegram API error:', {
                description: error.response.description,
                error_code: error.response.error_code
            });

            if (error.response.error_code === 401) {
                console.error('💡 Solution: Check if Telegram token is correct');
            } else if (error.response.error_code === 400) {
                console.error('💡 Solution: Check if chat ID is correct');
            } else if (error.response.error_code === 403) {
                console.error('💡 Solution: User blocked the bot');
            }
        }
    }
};

export const setupAdminBot = () => {
    if (!token || !adminChatId) {
        console.log('❌ Telegram bot not configured - skipping bot setup');
        return;
    }

    try {
        console.log('✅ Telegram bot started with Telegraf');

        bot.start((ctx) => {
            const chatId = ctx.chat.id.toString();

            if (chatId !== adminChatId) {
                ctx.reply('❌ Этот бот только для администратора.');
                console.log(`🚫 Unauthorized access attempt from: ${chatId}`);
                return;
            }

            ctx.reply('👋 Бот уведомлений запущен! Вы будете получать уведомления о новых записях.');
            console.log(`✅ Admin started the bot: ${chatId}`);
        });
        bot.launch().then(() => {
            console.log('🤖 Telegram bot is running with Telegraf');
        });
        bot.catch((error) => {
            console.error('❌ Telegram bot error:', error);
        });

    } catch (error) {
        console.error('❌ Failed to setup Telegram bot:', error.message);
    }
};

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));