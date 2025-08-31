import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '@/api/users.js';
import { getProfile } from '@/api/users.js';
import { useAuth } from '@/hooks/useAuth.js';
import { useToast } from '@/hooks/useToast';
import {
    validateUsername,
    validateEmail,
    validatePassword,
} from '@/utils/validators';
import './AuthModal.scss';

const AuthModal = ({ isOpen, onClose }) => {
    const [tab, setTab] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация
        if (tab === 'register') {
            const usernameError = validateUsername(username);
            if (usernameError) {
                addToast(usernameError, 'error');
                return;
            }
        }
        const emailError = validateEmail(email);
        if (emailError) {
            addToast(emailError, 'error');
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            addToast(passwordError, 'error');
            return;
        }

        try {
            if (tab === 'register') {
                await register(username, email, password);
                setTab('login');
            } else {
                await login(email, password);
                const res = await getProfile();
                setUser(res.data);
                onClose();
                navigate('/profile');
            }
        } catch (err) {
            addToast(`${err.response?.data?.message || 'Ошибка'}`, 'error');
        }
    };

    return (
        <div className="auth-modal">
            <div className="auth-modal__overlay" onClick={onClose}></div>
            <div className="auth-modal__content">
                <button className="auth-modal__close" onClick={onClose}>
                    ✕
                </button>

                <div className="auth-modal__tabs">
                    <button
                        className={`auth-modal__tab ${
                            tab === 'login' ? 'active' : ''
                        }`}
                        onClick={() => setTab('login')}
                    >
                        Вход
                    </button>
                    <button
                        className={`auth-modal__tab ${
                            tab === 'register' ? 'active' : ''
                        }`}
                        onClick={() => setTab('register')}
                    >
                        Регистрация
                    </button>
                </div>

                <form className="auth-modal__form" onSubmit={handleSubmit}>
                    {tab === 'register' && (
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value.replace(/\s/g, ''))
                            }
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value.replace(/\s/g, ''))
                        }
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value.replace(/\s/g, ''))
                        }
                        required
                    />
                    <button type="submit" className="auth-modal__submit">
                        {tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
