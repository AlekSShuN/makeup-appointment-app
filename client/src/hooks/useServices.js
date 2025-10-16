import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://makeup-appointment-app-backend.onrender.com/api';

export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            console.log('🔍 Fetching services from API...');

            const response = await fetch(`${API_BASE_URL}/services`);

            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }

            const services = await response.json();
            console.log('✅ Received services from API:', services);

            return services;
        },
        staleTime: 60 * 60 * 1000,
        retry: 2,
    });
};