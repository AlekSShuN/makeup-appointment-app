import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './Calendar.module.css';

const MONTH_NAMES = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const Calendar = ({
    value,
    onChange,
    onBlur,
    minDate,
    maxDate,
    className = '',
    error = false,
    disabledDays = []
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = useRef(null);

    // Мемоизированные значения
    const today = useMemo(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }, []);

    const min = useMemo(() => {
        const minDateValue = minDate ? new Date(minDate) : today;
        return new Date(minDateValue.getFullYear(), minDateValue.getMonth(), minDateValue.getDate());
    }, [minDate, today]);

    const max = useMemo(() => {
        const maxDateValue = maxDate ? new Date(maxDate) : new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        return new Date(maxDateValue.getFullYear(), maxDateValue.getMonth(), maxDateValue.getDate());
    }, [maxDate, today]);

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setCurrentMonth(date);
            }
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const getDaysInMonth = useCallback((date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        for (let i = 0; i < (firstDay.getDay() || 7) - 1; i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, []);

    const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth, getDaysInMonth]);

    const handleDateSelect = useCallback((date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        console.log('Selected date:', date, 'Formatted:', formattedDate);

        onChange(formattedDate);
        setIsOpen(false);
        onBlur?.();
    }, [onChange, onBlur]);

    const navigateMonth = useCallback((direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    }, []);

    // Проверка доступности даты
    const isDateDisabled = useCallback((date) => {
        const isPastMin = date < min;
        const isFutureMax = date > max;
        const isDisabledDay = disabledDays.includes(date.getDay());

        return isPastMin || isFutureMax || isDisabledDay;
    }, [min, max, disabledDays]);

    // Проверка доступности навигации
    const canNavigatePrev = useMemo(() => {
        const prevMonth = new Date(currentMonth);
        prevMonth.setMonth(currentMonth.getMonth() - 1);
        return prevMonth >= new Date(min.getFullYear(), min.getMonth(), 1);
    }, [currentMonth, min]);

    const canNavigateNext = useMemo(() => {
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(currentMonth.getMonth() + 1);
        return nextMonth <= new Date(max.getFullYear(), max.getMonth() + 1, 0);
    }, [currentMonth, max]);

    // Форматирование даты
    const formatDisplayDate = useCallback((dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);

        if (isNaN(date.getTime())) return '';

        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }, []);

    const handleInputKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(prev => !prev);
        } else if (e.key === 'Escape' && isOpen) {
            setIsOpen(false);
        }
    }, [isOpen]);

    const handleCalendarButtonKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }
    }, []);

    return (
        <div className={`${styles.calendarContainer} ${className}`} ref={calendarRef}>
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    value={formatDisplayDate(value)}
                    readOnly
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={onBlur}
                    className={`${styles.input} ${error ? styles.error : ''}`}
                    placeholder="Выберите дату"
                    aria-label="Выберите дату"
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                />
                <button
                    type="button"
                    className={styles.calendarButton}
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleCalendarButtonKeyDown}
                    aria-label="Открыть календарь"
                >
                    📅
                </button>
            </div>

            {isOpen && (
                <div
                    className={styles.calendarDropdown}
                    role="dialog"
                    aria-label="Календарь для выбора даты"
                    aria-modal="true"
                >
                    <div className={styles.calendarHeader}>
                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={() => navigateMonth(-1)}
                            disabled={!canNavigatePrev}
                            aria-label="Предыдущий месяц"
                        >
                            ‹
                        </button>
                        <span className={styles.monthYear}>
                            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={() => navigateMonth(1)}
                            disabled={!canNavigateNext}
                            aria-label="Следующий месяц"
                        >
                            ›
                        </button>
                    </div>

                    <div className={styles.calendarGrid}>
                        {DAY_NAMES.map(day => (
                            <div key={day} className={styles.dayHeader}>{day}</div>
                        ))}

                        {days.map((date, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`${styles.day} ${date ? (
                                    value === date.toISOString().split('T')[0] ? styles.selected :
                                        isDateDisabled(date) ? styles.disabled :
                                            styles.available
                                ) : styles.empty
                                    }`}
                                onClick={() => date && !isDateDisabled(date) && handleDateSelect(date)}
                                disabled={!date || isDateDisabled(date)}
                                aria-label={date ? date.toLocaleDateString('ru-RU') : 'Пустая ячейка'}
                                aria-selected={value === date?.toISOString().split('T')[0]}
                            >
                                {date ? date.getDate() : ''}
                            </button>
                        ))}
                    </div>

                    <div className={styles.calendarFooter}>
                        <button
                            type="button"
                            className={styles.todayButton}
                            onClick={() => handleDateSelect(today)}
                            disabled={isDateDisabled(today)}
                            aria-label="Выбрать сегодняшнюю дату"
                        >
                            Сегодня
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;