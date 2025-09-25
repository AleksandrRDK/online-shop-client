import api from '../http';

export const getCart = async () => {
    try {
        const response = await api.get('/carts');
        return response.data;
    } catch (err) {
        console.error(
            'Ошибка при получении корзины:',
            err.response?.data || err
        );
        throw err;
    }
};

export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await api.post('/carts', { productId, quantity });
        return response.data;
    } catch (err) {
        console.error(
            'Ошибка при добавлении товара в корзину:',
            err.response?.data || err
        );
        throw err;
    }
};

export const removeFromCart = async (productId) => {
    try {
        const response = await api.delete(`/carts/${productId}`);
        return response.data;
    } catch (err) {
        console.error(
            'Ошибка при удалении товара из корзины:',
            err.response?.data || err
        );
        throw err;
    }
};
