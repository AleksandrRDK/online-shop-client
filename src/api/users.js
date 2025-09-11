import axios from 'axios';
import { API_URL } from '@/config/config';

const USERS_URL = `${API_URL}/users`;

// фабрика axios с Authorization
export const getAPI = (accessToken) =>
    axios.create({
        baseURL: USERS_URL,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
    });

// --- ПРОФИЛЬ ---
export const getProfile = async (accessToken) => {
    const API = getAPI(accessToken);
    const res = await API.get('/profile');
    return res.data;
};

export const updateProfile = async (accessToken, userData) => {
    const API = getAPI(accessToken);
    const res = await API.put('/profile', userData);
    return res.data;
};

export const deleteProfile = async (accessToken) => {
    const API = getAPI(accessToken);
    const res = await API.delete('/profile');
    return res.data;
};

// --- АВАТАР ---
export const uploadAvatar = async (accessToken, file) => {
    const API = getAPI(accessToken);
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await API.put('/profile/avatar', formData, {
        headers: {
            ...API.defaults.headers,
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const deleteAvatar = async (accessToken) => {
    const API = getAPI(accessToken);
    const res = await API.delete('/profile/avatar');
    return res.data;
};
