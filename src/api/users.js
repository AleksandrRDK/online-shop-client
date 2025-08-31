import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/users';
const API_URL = 'online-shop-server-production-a585.up.railway.app/api/users';

const API = axios.create({
    baseURL: API_URL,
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
