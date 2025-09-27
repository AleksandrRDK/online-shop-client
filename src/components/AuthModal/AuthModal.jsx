import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { useToast } from '@/hooks/useToast';
import {
    validateUsername,
    validateEmail,
    validatePassword,
} from '@/utils/validators';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import './AuthModal.scss';

function AuthModal({ onClose = () => {}, isOpen }) {
    const [tab, setTab] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { registerUser, loginUser } = useAuth();
    const { addToast } = useToast();

    // закрытие на Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            setLoading(true);

            if (tab === 'register') {
                await registerUser(username, email, password);
                addToast(
                    'Регистрация прошла успешно! Вы вошли в систему.',
                    'success'
                );
                onClose();
            } else {
                await loginUser(email, password);
                onClose();
            }
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.message || 'Ошибка', 'error');
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <Motion.div
                    className="auth-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* overlay */}
                    <Motion.div
                        className="auth-modal__overlay"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    ></Motion.div>

                    {/* content */}
                    <Motion.div
                        className="auth-modal__content"
                        initial={{ opacity: 0, scale: 0.8, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
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

                        <form
                            className="auth-modal__form"
                            onSubmit={handleSubmit}
                        >
                            {tab === 'register' && (
                                <input
                                    type="text"
                                    placeholder="Имя пользователя"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value.replace(/\s/g, '')
                                        )
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
                                    setPassword(
                                        e.target.value.replace(/\s/g, '')
                                    )
                                }
                                required
                            />
                            <button
                                type="submit"
                                className="auth-modal__submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <LoadingSpinner size={20} />
                                ) : tab === 'login' ? (
                                    'Войти'
                                ) : (
                                    'Зарегистрироваться'
                                )}
                            </button>
                        </form>
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default AuthModal;
