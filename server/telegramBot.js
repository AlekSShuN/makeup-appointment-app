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
    console.log('🔔 [Telegram] Function called with data:', {
        bookingId: bookingData.bookingId,
        clientName: bookingData.client?.name,
        service: service?.name
    });

    if (!token || !adminChatId || !bot) {
        console.log('❌ [Telegram] Bot not configured:', {
            hasToken: !!token,
            hasChatId: !!adminChatId,
            hasBotInstance: !!bot
        });
        return false;
    }

    try {
        const message = `
🎉 Новая запись!

Услуга: ${service?.name || 'Не указана'}
${service?.price != null ? `Сумма: ${Number(service.price).toLocaleString('ru-RU')} ₽` : ''}
Дата: ${bookingData.date}
Время: ${bookingData.time}

Клиент:
Имя: ${bookingData.client.name}
Телефон: ${bookingData.client.phone}
${bookingData.client.comment ? `Комментарий: ${bookingData.client.comment}` : ''}

ID записи: ${bookingData.bookingId}
        `.trim();

        console.log('📤 [Telegram] Attempting to send message...');
        console.log('   To chat ID:', adminChatId);
        console.log('   Message length:', message.length);
        console.log('   Message preview:', message.substring(0, 100) + '...');

        const result = await bot.telegram.sendMessage(adminChatId, message);
        console.log('✅ [Telegram] Notification sent successfully! Message ID:', result.message_id);
        return true;

    } catch (error) {
        console.error('❌ [Telegram] Failed to send notification:', error.message);

        if (error.response) {
            console.error('📋 [Telegram] API error details:', {
                description: error.response.description,
                error_code: error.response.error_code,
                parameters: error.response.parameters
            });

            if (error.response.error_code === 401) {
                console.error('💡 Solution: Check if Telegram token is correct');
            } else if (error.response.error_code === 400) {
                console.error('💡 Solution: Check if chat ID is correct or user blocked the bot');
            } else if (error.response.error_code === 403) {
                console.error('💡 Solution: User blocked the bot');
            }
        } else {
            console.error('📋 [Telegram] Error stack:', error.stack);
        }
        return false;
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
            console.log(`👋 [Telegram] /start command from: ${chatId}`);

            if (chatId !== adminChatId) {
                ctx.reply('❌ Этот бот только для администратора.');
                console.log(`🚫 Unauthorized access attempt from: ${chatId}`);
                return;
            }

            ctx.reply('👋 Бот уведомлений запущен! Вы будете получать уведомления о новых записях.');
            console.log(`✅ Admin started the bot: ${chatId}`);
        });

        // Добавляем обработчик сообщений для дебага
        bot.on('message', (ctx) => {
            const chatId = ctx.chat.id.toString();
            console.log(`📩 [Telegram] Message from ${chatId}: ${ctx.message.text}`);
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

// Graceful shutdown
process.once('SIGINT', () => {
    console.log('🛑 Shutting down bot...');
    bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    console.log('🛑 Shutting down bot...');
    bot.stop('SIGTERM');
});