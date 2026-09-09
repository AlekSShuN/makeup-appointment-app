import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../lib/api.js';

// Хук для проверки доступных слотов времени
export const useAvailableSlots = (date, serviceId) => {
    return useQuery({
        queryKey: ['availableSlots', date, serviceId],
        queryFn: async () => {
            if (!date || !serviceId) {
                return [];
            }

            const response = await fetch(
                `${API_BASE_URL}/bookings/booking-slots?date=${date}&serviceId=${serviceId}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch available slots');
            }

            return await response.json();
        },
        enabled: !!date && !!serviceId,
        staleTime: 2 * 60 * 1000,
    });
};

// Хук для создания бронирования
export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bookingData) => {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create booking');
            }

            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['availableSlots'] });
        },
    });
};