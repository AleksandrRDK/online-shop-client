import { createContext, useState, useEffect } from 'react';
import { useUsersApi } from '@/api/users';
import { refreshAccessToken, register, login, logout } from '@/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getProfile } = useUsersApi();

    const registerUser = async (username, email, password) => {
        const res = await register(username, email, password);
        localStorage.setItem('accessTokenShop', res.accessToken);
        setUser(res.user);
        return res;
    };

    const loginUser = async (email, password) => {
        const res = await login(email, password);
        localStorage.setItem('accessTokenShop', res.accessToken);
        setUser(res.user);
        return res;
    };

    const logoutUser = async () => {
        const res = await logout();
        localStorage.removeItem('accessTokenShop');
        setUser(null);
        return res;
    };

    // авто-загрузка профиля при старте
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (localStorage.getItem('accessTokenShop')) {
                    const profile = await getProfile();
                    setUser(profile);
                } else {
                    // пробуем обновить токен через refresh
                    const newToken = await refreshAccessToken();
                    localStorage.setItem('accessTokenShop', newToken);

                    const profile = await getProfile();
                    setUser(profile);
                }
            } catch (err) {
                console.error('[AuthProvider] авто-логин не удался:', err);
                localStorage.removeItem('accessTokenShop');
                setUser(null);
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
                loading,
                setLoading,
                registerUser,
                loginUser,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
