import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../lib/api.js';
import { FALLBACK_SERVICES } from '../data/services.js';

export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/services`);

            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }

            const services = await response.json();
            return Array.isArray(services) && services.length > 0
                ? services
                : FALLBACK_SERVICES;
        },
        staleTime: 60 * 60 * 1000,
        retry: 1,
        placeholderData: FALLBACK_SERVICES,
    });
};