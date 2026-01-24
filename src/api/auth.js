import axios from 'axios';
import api from '@/http/index';
import { API_URL } from '@/http/config';

const AUTH_URL = `${API_URL}/auth`;

const API = axios.create({
    baseURL: AUTH_URL,
    withCredentials: true,
});

// регистрация
export const register = async (username, email, password) => {
    try {
        const res = await API.post('/register', { username, email, password });
        return res.data; // { accessToken, user }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw err.response?.data;
        }
        throw err;
    }
};

// логин
export const login = async (email, password) => {
    const res = await API.post('/login', { email, password });
    return res.data; // { accessToken, user }
};

// refresh токен (обновление access token)
export const refreshAccessToken = async () => {
    const res = await API.post('/refresh');
    return res.data.accessToken;
};

// logout
export const logout = async () => {
    const res = await api.post('/auth/logout');
    return res.data;
};
