import { getAPI } from '@/http/index';

export const createPayment = async (accessToken) => {
    try {
        const API = getAPI(accessToken);
        const response = await API.post('/payment/create');
        return response.data;
    } catch (err) {
        console.error(
            'Ошибка при создании платежа:',
            err.response?.data || err
        );
        throw err;
    }
};
