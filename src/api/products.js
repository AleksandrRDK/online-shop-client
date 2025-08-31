import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/products';
const API_URL =
    'online-shop-server-production-a585.up.railway.app/api/products';

export const getProducts = async () => {
    try {
        const { data } = await axios.get(API_URL);
        return data;
    } catch (err) {
        console.error('Ошибка при получении товаров:', err);
        throw err;
    }
};

export const getProductsByUser = async (userId) => {
    try {
        const { data } = await axios.get(`${API_URL}/user/${userId}`);
        return data;
    } catch (err) {
        console.error(
            `Ошибка при получении товаров пользователя ${userId}:`,
            err
        );
        throw err;
    }
};

export const getProductById = async (id) => {
    try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data;
    } catch (err) {
        console.error(`Ошибка при получении товара ${id}:`, err);
        throw err;
    }
};

export const createProduct = async (product) => {
    try {
        const { data } = await axios.post(API_URL, product);
        return data;
    } catch (err) {
        console.error('Ошибка при создании товара:', err);
        throw err;
    }
};

export const updateProduct = async (id, product) => {
    try {
        const { data } = await axios.put(`${API_URL}/${id}`, product);
        return data;
    } catch (err) {
        console.error(`Ошибка при обновлении товара ${id}:`, err);
        throw err;
    }
};

export const deleteProduct = async (id) => {
    try {
        const { data } = await axios.delete(`${API_URL}/${id}`);
        return data;
    } catch (err) {
        console.error(`Ошибка при удалении товара ${id}:`, err);
        throw err;
    }
};
