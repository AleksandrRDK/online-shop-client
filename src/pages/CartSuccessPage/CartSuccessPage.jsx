import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getOrderById } from '@/api/orders';
import Header from '@/components/Header/Header';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import './CartSuccessPage.scss';
import '@/styles/back-btn.scss';

function CartSuccessPage() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const id = orderId || location.state?.orderId;

    useEffect(() => {
        if (!id) {
            console.log(`id=${id}`);
            console.log(`orderid=${orderId}`);
            navigate('/');
            return;
        }

        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await getOrderById(id);
                setOrder(data);
            } catch (err) {
                console.error('Ошибка загрузки заказа:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, navigate]);

    if (loading) {
        return (
            <>
                <Header />
                <LoadingSpinner size={160} color="#3aaed8" />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Header />
                <div className="container">
                    <p>Заказ не найден</p>
                </div>
            </>
        );
    }

    const statusText =
        order.status === 'succeeded'
            ? 'Оплата прошла успешно!'
            : order.status === 'canceled'
            ? 'Оплата отменена'
            : 'Платёж обрабатывается';

    return (
        <>
            <Header />
            <div className="container cart-success-page">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Назад
                </button>
                <h2 className={order.status}>{statusText}</h2>
                {order.status === 'succeeded' && (
                    <p>Сумма заказа: {order.totalPrice} ₽</p>
                )}
                <button
                    onClick={() => navigate('/')}
                    className="back-to-calatoge"
                >
                    Вернуться в каталог
                </button>
            </div>
        </>
    );
}

export default CartSuccessPage;
