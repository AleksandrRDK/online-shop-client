import axios from 'axios';
import { API_URL } from '@/config/config';

export const createPayment = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/payment/create`, {
            userId,
        });
        return response.data;
    } catch (err) {
        console.error(
            'Ошибка при создании платежа:',
            err.response?.data || err
        );
        throw err;
    }
};
