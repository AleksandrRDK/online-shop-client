import api from '../http';

export const createPayment = async () => {
    try {
        const response = await api.post('/payment/create');
        return response.data;
    } catch (err) {
        console.error(
            '[usePaymentApi] Ошибка при создании платежа:',
            err.response?.data || err
        );
        throw err;
    }
};
