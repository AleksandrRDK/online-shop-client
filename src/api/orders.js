import axios from 'axios';
import { API_URL, getAPI } from '@/http/index';

export const getUserOrders = async (accessToken) => {
    try {
        const API = getAPI(accessToken);
        const response = await API.get(`/orders/user`);
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
