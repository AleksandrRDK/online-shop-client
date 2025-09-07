import {
    validateUsername,
    validateEmail,
    validatePassword,
} from '@/utils/validators';
import { useToast } from '@/hooks/useToast';
import { updateProfile, deleteProfile, logout } from '@/api/users.js';
import { useNavigate } from 'react-router-dom';

function ProfileModal({ formData, setFormData, setIsOpen, setUser, user }) {
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.replace(/\s/g, ''),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Валидация
        const usernameError = validateUsername(formData.username);
        const emailError = validateEmail(formData.email);
        const passwordError = formData.password
            ? validatePassword(formData.password)
            : null;

        if (usernameError) return addToast(usernameError, 'error');
        if (emailError) return addToast(emailError, 'error');
        if (passwordError) return addToast(passwordError, 'error');

        try {
            const updatedUser = await updateProfile(formData);
            setUser(updatedUser);
            addToast('Данные обновлены!', 'success');
            setIsOpen(false);
        } catch (err) {
            addToast(`Ошибка при обновлении данных ${err}`, 'error');
        }
    };

    const handleLogout = () => {
        try {
            logout();
        } catch (error) {
            addToast('Ошибка при выходе', 'error');
            console.error(error);
        }
        setUser(null);
        addToast('Вы вышли из аккаунта', 'success');
        navigate('/');
    };

    const handleDelete = async () => {
        if (!window.confirm('Ты точно хочешь удалить аккаунт? 😢')) return;
        try {
            await deleteProfile();
            alert('Аккаунт удалён');
            navigate('/');
        } catch (err) {
            console.error('Ошибка при удалении:', err);
        }
    };

    return (
        <div className="modal__content">
            <h2>Редактировать профиль</h2>
            <form onSubmit={handleSubmit} className="product-form">
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Имя"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Новый пароль"
                />
                <button type="submit" className="btn-black">
                    Сохранить
                </button>
            </form>
            <button type="button" className="logout" onClick={handleLogout}>
                Выйти
            </button>
            <button onClick={handleDelete} className="danger">
                Удалить аккаунт
            </button>
            <button
                className="btn-black"
                onClick={() => {
                    setIsOpen(false);
                    setFormData({
                        username: user.username,
                        email: user.email,
                        password: '',
                    });
                }}
            >
                Закрыть
            </button>
        </div>
    );
}

export default ProfileModal;
