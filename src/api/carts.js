// const API_URL = 'http://localhost:5000/api/carts';
const API_URL = 'online-shop-server-production-a585.up.railway.app/api/carts';

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const res = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId, quantity }),
        });

        if (!res.ok) throw new Error('Ошибка при добавлении в корзину');
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getCart = async (userId) => {
    try {
        const res = await fetch(`${API_URL}/${userId}`);
        if (!res.ok) throw new Error('Ошибка при загрузке корзины');
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const removeFromCart = async (userId, productId) => {
    try {
        const res = await fetch(`${API_URL}/${userId}/${productId}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Ошибка при удалении товара');
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};
