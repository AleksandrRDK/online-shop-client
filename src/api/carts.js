import axios from 'axios';
import { API_URL } from '@/config/config';

const CARTS_URL = `${API_URL}/carts`;

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const res = await axios.post(CARTS_URL, {
            userId,
            productId,
            quantity,
        });
        return res.data;
    } catch (err) {
        console.error('Ошибка при добавлении в корзину:', err);
        throw err;
    }
};

export const getCart = async (userId) => {
    try {
        const res = await axios.get(`${CARTS_URL}/${userId}`);
        return res.data;
    } catch (err) {
        console.error('Ошибка при загрузке корзины:', err);
        throw err;
    }
};

export const removeFromCart = async (userId, productId) => {
    try {
        const res = await axios.delete(`${CARTS_URL}/${userId}/${productId}`);
        return res.data;
    } catch (err) {
        console.error('Ошибка при удалении товара:', err);
        throw err;
    }
};
