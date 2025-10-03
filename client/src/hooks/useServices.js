import { useQuery } from '@tanstack/react-query';

const mockServices = {
    services: [
        {
            id: 1,
            name: "Макияж дневной",
            price: 1500,
            duration: 60,
            description: "Естественный макияж для повседневного образа"
        },
        {
            id: 2,
            name: "Макияж вечерний",
            price: 2000,
            duration: 90,
            description: "Яркий макияж для вечерних мероприятий"
        },
        {
            id: 3,
            name: "Свадебный макияж",
            price: 3000,
            duration: 120,
            description: "Особый макияж для самого важного дня"
        }
    ]
};

export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            console.log('✅ Using mock services data');
            return mockServices;
        },
        staleTime: 60 * 60 * 1000,
    });
};