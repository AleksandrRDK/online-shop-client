import api from '../http';

export const getUserOrders = async () => {
    try {
        const response = await api.get('/orders/user');
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
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (err) {
        console.error('Ошибка получения заказа:', err.response?.data || err);
        throw err;
    }
};
