import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pica from 'pica';
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validateAvatar,
} from '@/utils/validators';
import { useToast } from '@/hooks/useToast';
import {
    updateProfile,
    deleteProfile,
    uploadAvatar,
    deleteAvatar,
} from '@/api/users.js';
import { logout as logoutAPI } from '@/api/auth.js';
import { useAuth } from '@/hooks/useAuth.js';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import defaultAvatar from '@/assets/default-avatar.png';

function ProfileModal({ formData, setFormData, setIsOpen }) {
    const { user, setUser, accessToken } = useAuth();
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

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

        const usernameError = validateUsername(formData.username);
        const emailError = validateEmail(formData.email);
        const passwordError = formData.password
            ? validatePassword(formData.password)
            : null;

        if (usernameError) return addToast(usernameError, 'error');
        if (emailError) return addToast(emailError, 'error');
        if (passwordError) return addToast(passwordError, 'error');

        try {
            const updatedUser = await updateProfile(accessToken, formData);
            setUser(updatedUser);
            addToast('Данные обновлены!', 'success');
            setIsOpen(false);
        } catch (err) {
            addToast(
                `Ошибка при обновлении данных: ${
                    err.response?.data?.message || err
                }`,
                'error'
            );
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await logoutAPI(user._id);
            setUser(null);
            addToast('Вы вышли из аккаунта', 'success');
            navigate('/');
        } catch (err) {
            console.error(err);
            addToast('Ошибка при выходе', 'error');
        } finally {
            setLogoutLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Ты точно хочешь удалить аккаунт? 😢')) return;
        try {
            await deleteProfile(accessToken);
            setUser(null);
            addToast('Аккаунт был удалён', 'success');
            navigate('/');
        } catch (err) {
            console.error('Ошибка при удалении:', err);
            addToast('Ошибка при удалении аккаунта', 'error');
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const error = validateAvatar(file);
        if (error) return addToast(error, 'error');

        const pica = Pica();
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        await img.decode();

        const canvas = document.createElement('canvas');
        const maxDim = 512;
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        await pica.resize(img, canvas);

        const blob = await pica.toBlob(canvas, file.type);
        const compressedFile = new File([blob], file.name, { type: file.type });

        setAvatarPreview(URL.createObjectURL(compressedFile));
        setAvatarFile(compressedFile);
    };

    const handleSaveAvatar = async () => {
        if (!avatarFile) return addToast('Выберите аватар', 'error');

        setAvatarLoading(true);
        try {
            const updatedUser = await uploadAvatar(accessToken, avatarFile);
            setUser(updatedUser);
            addToast('Аватар обновлён!', 'success');
            setAvatarFile(null);
        } catch (err) {
            console.error(err);
            addToast('Ошибка при обновлении аватара', 'error');
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        setAvatarLoading(true);
        try {
            await deleteAvatar(accessToken);
            setUser((prev) => ({ ...prev, avatar: null }));
            setAvatarPreview('');
            setAvatarFile(null);
            addToast('Аватар удалён', 'success');
        } catch (err) {
            console.error(err);
            addToast('Ошибка при удалении аватара', 'error');
        } finally {
            setAvatarLoading(false);
        }
    };

    return (
        <div className="modal__content">
            <h2>Редактировать профиль</h2>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="profile-avatar">
                    <img
                        src={avatarPreview || defaultAvatar}
                        alt="Аватар"
                        className="avatar-preview"
                        onError={(e) => (e.target.src = defaultAvatar)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    <button
                        type="button"
                        className="btn-black"
                        onClick={handleSaveAvatar}
                        disabled={avatarLoading || !avatarFile}
                    >
                        {avatarLoading ? (
                            <LoadingSpinner size={18} color="#fff" />
                        ) : (
                            'Сохранить аватар'
                        )}
                    </button>
                    {avatarPreview && (
                        <button
                            type="button"
                            className="danger"
                            onClick={handleDeleteAvatar}
                            disabled={avatarLoading}
                        >
                            {avatarLoading ? (
                                <LoadingSpinner size={18} color="#fff" />
                            ) : (
                                'Удалить аватар'
                            )}
                        </button>
                    )}
                </div>

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

            <button
                type="button"
                className="logout"
                onClick={handleLogout}
                disabled={logoutLoading}
            >
                {logoutLoading ? (
                    <LoadingSpinner size={18} color="#fff" />
                ) : (
                    'Выйти'
                )}
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
