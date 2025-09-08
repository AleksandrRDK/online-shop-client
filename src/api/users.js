import axios from 'axios';
import { API_URL } from '@/config/config';
const USERS_URL = `${API_URL}/users`;

const API = axios.create({
    baseURL: USERS_URL,
    withCredentials: true,
});

export const register = async (username, email, password) => {
    return API.post('/register', { username, email, password });
};

export const login = async (email, password) => {
    const res = await API.post('/login', { email, password });
    return res.data.user;
};

export const logout = async () => {
    const res = await API.post('/logout');
    return res.data;
};

export const getProfile = async () => {
    return API.get('/profile');
};

export const updateProfile = async (userData) => {
    try {
        const res = await API.put('/profile', userData);
        return res.data;
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        throw error;
    }
};

export const deleteProfile = async () => {
    try {
        const res = await API.delete('/profile');
        return res.data;
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        throw error;
    }
};

// Загрузка/обновление аватара
export const uploadAvatar = async (file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file); // 'avatar' соответствует ключу в multer.single('avatar')

        const res = await API.put('/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
        throw error;
    }
};

// Удаление аватара
export const deleteAvatar = async () => {
    try {
        const res = await API.delete('/profile/avatar');
        return res.data;
    } catch (error) {
        console.error('Ошибка при удалении аватара:', error);
        throw error;
    }
};
