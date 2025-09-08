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

// Проверка картинки
export const validateAvatar = (file) => {
    if (!file) return 'Файл не выбран';

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeMB = 5; // Максимальный размер в мегабайтах

    if (!validTypes.includes(file.type)) {
        return 'Неверный формат. Допустимы: JPG, PNG, WEBP';
    }

    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSizeMB) {
        return `Файл слишком большой. Максимум ${maxSizeMB} МБ`;
    }

    return null;
};
