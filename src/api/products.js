import axios from 'axios';
import { API_URL } from '@/config/config';
const PRODUCTS_URL = `${API_URL}/products`;

export const getProducts = async (
    page = 1,
    limit = 48,
    filter = 'all',
    tags = []
) => {
    try {
        const params = { page, limit, filter };
        if (tags.length) params.tags = tags.join(',');
        const { data } = await axios.get(PRODUCTS_URL, { params });
        return data;
    } catch (err) {
        console.error('Ошибка при получении товаров:', err);
        throw err;
    }
};

export const getProductsByUser = async (userId, page = 1, limit = 48) => {
    try {
        const { data } = await axios.get(`${PRODUCTS_URL}/user/${userId}`, {
            params: { page, limit },
        });
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
        const { data } = await axios.get(`${PRODUCTS_URL}/${id}`);
        return data;
    } catch (err) {
        console.error(`Ошибка при получении товара ${id}:`, err);
        throw err;
    }
};

export const createProduct = async (product, file) => {
    try {
        const formData = new FormData();
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('ownerId', product.ownerId);
        if (product.tags) {
            const tagsArray = product.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
            formData.append('tags', JSON.stringify(tagsArray));
        }
        if (product.characteristics)
            formData.append(
                'characteristics',
                JSON.stringify(product.characteristics)
            );
        if (file) formData.append('image', file);

        const { data } = await axios.post(PRODUCTS_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (err) {
        console.error('Ошибка при создании товара:', err);
        throw err;
    }
};

export const updateProduct = async (id, product, file) => {
    try {
        const formData = new FormData();
        if (product.title) formData.append('title', product.title);
        if (product.description)
            formData.append('description', product.description);
        if (product.price !== undefined)
            formData.append('price', product.price);
        if (product.tags) formData.append('tags', JSON.stringify(product.tags));
        if (product.characteristics)
            formData.append(
                'characteristics',
                JSON.stringify(product.characteristics)
            );
        if (file) formData.append('image', file);

        const { data } = await axios.put(`${PRODUCTS_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (err) {
        console.error(`Ошибка при обновлении товара ${id}:`, err);
        throw err;
    }
};

export const deleteProduct = async (id) => {
    try {
        const { data } = await axios.delete(`${PRODUCTS_URL}/${id}`);
        return data;
    } catch (err) {
        console.error(`Ошибка при удалении товара ${id}:`, err);
        throw err;
    }
};

export const getAllTags = async () => {
    try {
        const { data } = await axios.get(`${PRODUCTS_URL}/tags`);
        return data;
    } catch (err) {
        console.error('Ошибка при получении тегов:', err);
        throw err;
    }
};
