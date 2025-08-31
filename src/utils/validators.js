// Проверка имени (не меньше 4 символов)
export const validateUsername = (username) => {
    if (!username || username.trim().length < 4) {
        return 'Имя должно быть минимум 4 символа';
    }
    return null;
};

// Проверка email
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regex.test(email)) {
        return 'Введите корректный email';
    }
    return null;
};

// Проверка пароля (мин. 8 символов, без пробелов)
export const validatePassword = (password) => {
    if (!password) return 'Пароль обязателен';
    if (password.length < 8) return 'Пароль должен быть минимум 8 символов';
    if (/\s/.test(password)) return 'Пароль не должен содержать пробелы';
    return null;
};
