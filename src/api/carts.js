import { getAPI } from '@/http/index';

export const addToCart = async (productId, quantity = 1, accessToken) => {
    try {
        const API = getAPI(accessToken);
        const res = await API.post('/carts', {
            productId,
            quantity,
        });
        return res.data;
    } catch (err) {
        console.error('Ошибка при добавлении в корзину:', err);
        throw err;
    }
};

export const getCart = async (accessToken) => {
    try {
        const API = getAPI(accessToken);
        const res = await API.get('/carts');
        return res.data;
    } catch (err) {
        console.error('Ошибка при загрузке корзины:', err);
        throw err;
    }
};

export const removeFromCart = async (productId, accessToken) => {
    try {
        const API = getAPI(accessToken);
        const res = await API.delete(`/carts/${productId}`);
        return res.data;
    } catch (err) {
        console.error('Ошибка при удалении товара:', err);
        throw err;
    }
};
