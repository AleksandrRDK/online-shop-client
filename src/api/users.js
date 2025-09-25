import api from '../http';

const USERS_URL = '/users/profile';

export const useUsersApi = () => {
    const getProfile = async () => {
        try {
            const { data } = await api.get(USERS_URL);
            return data;
        } catch (err) {
            console.error(
                '[useUsersApi] Ошибка при получении профиля:',
                err.response?.data || err
            );
            throw err;
        }
    };

    const updateProfile = async (userData) => {
        try {
            const { data } = await api.put(USERS_URL, userData);
            return data;
        } catch (err) {
            console.error(
                '[useUsersApi] Ошибка при обновлении профиля:',
                err.response?.data || err
            );
            throw err;
        }
    };

    const deleteProfile = async () => {
        try {
            const { data } = await api.delete(USERS_URL);
            return data;
        } catch (err) {
            console.error(
                '[useUsersApi] Ошибка при удалении профиля:',
                err.response?.data || err
            );
            throw err;
        }
    };

    const uploadAvatar = async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const { data } = await api.put(`${USERS_URL}/avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        } catch (err) {
            console.error(
                '[useUsersApi] Ошибка при загрузке аватара:',
                err.response?.data || err
            );
            throw err;
        }
    };

    const deleteAvatar = async () => {
        try {
            const { data } = await api.delete(`${USERS_URL}/avatar`);
            return data;
        } catch (err) {
            console.error(
                '[useUsersApi] Ошибка при удалении аватара:',
                err.response?.data || err
            );
            throw err;
        }
    };

    return {
        getProfile,
        updateProfile,
        deleteProfile,
        uploadAvatar,
        deleteAvatar,
    };
};
