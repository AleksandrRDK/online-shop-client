import { createContext, useEffect, useState, useCallback } from 'react';
import { getProfile } from '@/api/users.js';
import { refreshAccessToken as refreshTokenAPI } from '@/api/auth.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Получение профиля пользователя через accessToken
    const fetchProfile = useCallback(async (token) => {
        try {
            const profile = await getProfile(token);
            setUser(profile);
        } catch {
            setUser(null);
        }
    }, []);

    // Функция обновления accessToken через refresh
    const handleRefreshToken = useCallback(async () => {
        try {
            if (!user?._id) return null;
            const newAccessToken = await refreshTokenAPI(user._id);
            setAccessToken(newAccessToken);
            return newAccessToken;
        } catch (err) {
            console.error('Не удалось обновить токен', err);
            setUser(null);
            setAccessToken(null);
            return null;
        }
    }, [user]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                const token = await refreshTokenAPI();
                if (token) {
                    setAccessToken(token);
                    await fetchProfile(token);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                if (accessToken) await fetchProfile(accessToken);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, [accessToken, fetchProfile]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                setAccessToken,
                loading,
                refreshAccessToken: handleRefreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
