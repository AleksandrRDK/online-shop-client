import { createContext, useState, useEffect } from 'react';
import api from '../http';
import { useUsersApi } from '../api/users';
import { refreshAccessToken } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { getProfile } = useUsersApi();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem('accessToken')
    );

    const loginForLS = (token, userData) => {
        localStorage.setItem('accessToken', token);
        setAccessToken(token);
        setUser(userData);
    };

    const logoutForLS = () => {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
    };

    // подставляем токен в хедеры при изменении
    useEffect(() => {
        if (accessToken) {
            api.defaults.headers.common[
                'Authorization'
            ] = `Bearer ${accessToken}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [accessToken]);

    // авто-загрузка профиля при старте
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (accessToken) {
                    const profile = await getProfile();
                    setUser(profile);
                } else {
                    // пробуем обновить токен через refresh
                    const newToken = await refreshAccessToken();
                    localStorage.setItem('accessToken', newToken);
                    setAccessToken(newToken);

                    const profile = await getProfile();
                    setUser(profile);
                }
            } catch (err) {
                console.error('[AuthProvider] авто-логин не удался:', err);
                logoutForLS();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                setAccessToken,
                loginForLS,
                logoutForLS,
                loading,
                setLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
