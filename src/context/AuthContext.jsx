import { createContext, useEffect, useState, useCallback } from 'react';
import { getProfile } from '@/api/users.js';
import { refreshAccessToken as refreshTokenAPI } from '@/api/auth.js';
import { useToast } from '@/hooks/useToast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Получение профиля пользователя через accessToken
    const fetchProfile = useCallback(async (token) => {
        try {
            const profile = await getProfile(token);
            setUser(profile);
        } catch (err) {
            addToast(`не удалось загрузить профиль - ${err?.message}`, 'error');
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
        let cancelled = false;
        const initAuth = async () => {
            try {
                setLoading(true);
                const token = await refreshTokenAPI();
                if (token && !cancelled) {
                    setAccessToken(token);
                    await fetchProfile(token);
                } else if (!token && !cancelled) {
                    setUser(null);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setUser(null);
                    setAccessToken(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        initAuth();
        return () => {
            cancelled = true;
        };
    }, []);
    // второй useEffect сбрасывал setLoading из за этого добавил cancelled, теперь loading отображается верно и нет никаких багов!
    useEffect(() => {
        if (!accessToken) return; // <-- ранний выход: предотвращаем мерцание на mount
        let cancelled = false;

        const initAuthWithAccess = async () => {
            try {
                setLoading(true);
                await fetchProfile(accessToken);
            } catch (err) {
                addToast(err.response?.data?.message, 'error');
                console.error(err);
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        initAuthWithAccess();

        return () => {
            cancelled = true;
        };
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
