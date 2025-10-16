// Регистрация Service Worker
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL || ''}/sw.js`;

            navigator.serviceWorker
                .register(swUrl)
                .then((registration) => {
                    console.log('✅ Service Worker registered:', registration);

                    // Проверка обновлений
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 New Service Worker found...');

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('🆕 New content available, please refresh.');
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        });
    }
};

// Уведомление об обновлении
const showUpdateNotification = () => {
    if (confirm('Доступна новая версия приложения. Обновить?')) {
        window.location.reload();
    }
};

// Проверка подключения
export const checkConnection = () => {
    return navigator.onLine;
};

// Подписка на изменения подключения
export const onConnectionChange = (callback) => {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
};