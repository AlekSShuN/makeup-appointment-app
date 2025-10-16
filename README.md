# Makeup Appointment App

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.4-purple)
![Express](https://img.shields.io/badge/Express-4.18.2-green)
![PWA](https://img.shields.io/badge/PWA-Ready-orange)

**Профессиональное веб-приложение для визажистов с системой онлайн-записи**

[Демо](#) • [Документация](#) • [Отчеты](#)

</div>

## Особенности

###  Для клиентов
- **Онлайн-запись** - Выбор услуги, даты и времени в несколько кликов
- **PWA поддержка** - Установка на телефон как нативное приложение
- **Мгновенная скорость** - Оптимизированная загрузка (95+ Lighthouse)
- **Telegram уведомления** - Мгновенные оповещения о новых записях
- **Адаптивный дизайн** - Идеально на всех устройствах

### Для администратора
- **Админ-панель** - Управление записями и клиентами
- **Просмотр статистики** - Аналитика бронирований
- **Умные уведомления** - Telegram-бот для мгновенных оповещений
- **Управление записями** - Просмотр, отмена бронирований

## Технологический стек

### Frontend
- **React 18** + Hooks
- **React Router DOM** - Навигация
- **Vite** - Сборка и разработка
- **CSS Modules** - Стилизация
- **PWA** - Progressive Web App
- **React Query** - Управление состоянием

### Backend
- **Node.js** + **Express.js** - Сервер
- **SQLite** - База данных
- **bcryptjs** - Безопасность
- **CORS** - Междоменные запросы
- **Helmet** - Защита приложения

## Быстрый старт

### Предварительные требования
- Node.js 16+
- npm 8+

### Установка и запуск

```bash
# Клонирование репозитория
git clone https://github.com/your-username/makeup-appointment-app.git
cd makeup-appointment-app

# Установка всех зависимостей (клиент + сервер)
npm run install:all

# Запуск в режиме разработки
npm run dev

# Или запуск отдельных частей
npm run dev:client    # Frontend (http://localhost:3000)
npm run dev:server    # Backend (http://localhost:5002)
