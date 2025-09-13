import { getAPI } from '@/http/index';

const USERS_URL = '/users/profile';

// --- ПРОФИЛЬ ---
export const getProfile = async (accessToken) => {
    const API = getAPI(accessToken);
    const res = await API.get(USERS_URL);
    return res.data;
};

export const updateProfile = async (accessToken, userData) => {
    const API = getAPI(accessToken);
    const res = await API.put(USERS_URL, userData);
    return res.data;
};

export const deleteProfile = async (accessToken) => {
    const API = getAPI(accessToken);
    const res = await API.delete(USERS_URL);
    return res.data;
};

// --- АВАТАР ---
export const uploadAvatar = async (accessToken, file) => {
    const API = getAPI(accessToken);
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await API.put(`${USERS_URL}/avatar`, formData, {
        headers: {
            ...API.defaults.headers,
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const deleteAvatar = async (accessToken) => {
    const API = getAPI(accessToken);
    const res = await API.delete(`${USERS_URL}/avatar`);
    return res.data;
};
