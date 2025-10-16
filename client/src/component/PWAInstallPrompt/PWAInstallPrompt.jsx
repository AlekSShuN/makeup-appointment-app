import { useState, useEffect } from 'react';
import styles from './PWAInstallPrompt.module.css';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            console.log('✅ PWA installed');
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ User accepted install');
        } else {
            console.log('❌ User dismissed install');
        }

        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    const handleIOSInstall = () => {
        alert(`Чтобы установить приложение:
1. Нажмите кнопку "Поделиться" 
2. Выберите "На экран «Домой»"
3. Нажмите "Добавить"`);
    };

    if (isStandalone || !isInstallable) return null;

    return (
        <div className={styles.installBanner}>
            <div className={styles.installContent}>
                <div className={styles.installText}>
                    <strong>Установите приложение!</strong>
                    <span>Быстрый доступ к записи без браузера</span>
                </div>

                <button
                    className={styles.installButton}
                    onClick={isIOS ? handleIOSInstall : handleInstallClick}
                >
                    {isIOS ? '📱 Установить' : '➕ Установить'}
                </button>

                <button
                    className={styles.closeButton}
                    onClick={() => setIsInstallable(false)}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;