import axios from 'axios';

import { API_URL } from '@/config/config';

export const getUserOrders = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/orders/user/${userId}`);
        return response.data;
    } catch (err) {
        console.error(
            'Ошибка при получении заказов пользователя:',
            err.response?.data || err
        );
        throw err;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const res = await axios.get(`${API_URL}/orders/${orderId}`);
        return res.data;
    } catch (err) {
        console.error('Ошибка получения заказа:', err.response?.data || err);
        throw err;
    }
};
