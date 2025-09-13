import axios from 'axios';

// export const API_URL = 'http://localhost:5000/api';
export const API_URL =
    'https://online-shop-server-production-a585.up.railway.app/api';

export const getAPI = (accessToken) =>
    axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
    });
