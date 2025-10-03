import { useQuery } from '@tanstack/react-query';

// Хук для проверки доступных слотов времени
export const useAvailableSlots = (date, serviceId) => {
    return useQuery({
        queryKey: ['availableSlots', date, serviceId],
        queryFn: async () => {
            console.log('Checking available slots for:', date, serviceId);

            // Мок данные - всегда возвращаем одни и те же слоты
            const availableSlots = [
                '09:00', '10:00', '11:00', '12:00',
                '14:00', '15:00', '16:00', '17:00'
            ];

            return availableSlots;
        },
    });
};

// Хук для создания бронирования
export const useCreateBooking = () => {
    return {
        mutate: async (bookingData) => {
            console.log('Creating booking:', bookingData);
            // Мок успешное создание
            return { success: true, id: Date.now() };
        },
        isLoading: false,
    };
};