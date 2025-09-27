import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '@/api/orders';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

import './OrdersModal.scss';

function OrdersModal({ onClose }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                const data = await getUserOrders();
                setOrders(data);
            } catch (err) {
                console.error('Ошибка загрузки заказов:', err);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    if (loading) {
        return (
            <div className="orders-modal">
                <LoadingSpinner size={120} />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-modal">
                <h3>Ваши заказы</h3>
                <p>У вас пока нет заказов</p>
                <button onClick={onClose}>Закрыть</button>
            </div>
        );
    }

    return (
        <div className="orders-modal">
            <h3>Ваши заказы</h3>
            <ul className="orders-list">
                {orders.map((order) => (
                    <li
                        key={order._id}
                        className="orders-item"
                        onClick={() => {
                            onClose();
                            navigate(`/cart/success/${order._id}`);
                        }}
                    >
                        <p>Заказ № {order._id.slice(-6)}</p>
                        <p>Статус: {order.status}</p>
                        <p>Сумма: {order.totalPrice} ₽</p>
                    </li>
                ))}
            </ul>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
}

export default OrdersModal;
