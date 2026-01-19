import { useState, useEffect } from 'react';
import { getCart, removeFromCart } from '@/api/carts';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { createPayment } from '@/api/payments';

import Header from '@/components/Header/Header';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import AuthModal from '@/components/AuthModal/AuthModal';
import defaultProduct from '@/assets/default-product.png';
import './CartPage.scss';

function CartPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [authOpen, setAuthOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);
    const [payLoading, setPayLoading] = useState(false);

    const openAuth = () => setAuthOpen(true);
    const closeAuth = () => setAuthOpen(false);

    useEffect(() => {
        if (user?.id) {
            loadCart();
        }
    }, [user]);

    const loadCart = async () => {
        try {
            setCartLoading(true);
            const data = await getCart();
            setCart(data);
        } catch (err) {
            console.error('Ошибка загрузки корзины:', err);
            addToast('Ошибка загрузки корзины', 'error');
        } finally {
            setCartLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const updatedCart = await removeFromCart(productId);
            setCart(updatedCart);
        } catch (err) {
            console.error('Ошибка удаления:', err);
            addToast('Ошибка удаления', 'error');
        }
    };

    const handlePay = async () => {
        if (!user?.id) {
            addToast('Войдите, чтобы оплатить', 'error');
            return;
        }

        if (cart.length === 0) {
            addToast('Корзина пуста', 'error');
            return;
        }

        try {
            setPayLoading(true);

            // Создаём платёж на бэке, бэк уже формирует return_url с orderId
            const { confirmationUrl } = await createPayment();

            if (!confirmationUrl) {
                addToast('Не удалось создать платёж', 'error');
                return;
            }

            // Перенаправляем пользователя на YooKassa
            window.location.href = confirmationUrl;
        } catch (err) {
            console.error('Ошибка оплаты:', err);
            addToast('Ошибка при создании платежа', 'error');
        } finally {
            setPayLoading(false);
        }
    };

    if (cartLoading) {
        return (
            <>
                <Header />
                <LoadingSpinner size={160} />
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Header />
                <div className="container">
                    <div className="cart-page">
                        <h2 className="cart-title">Корзина</h2>
                        <p className="cart-empty">
                            Войдите, чтобы использовать корзину
                        </p>
                        <button className="cart-checkout" onClick={openAuth}>
                            Войти
                        </button>
                        <AuthModal isOpen={authOpen} onClose={closeAuth} />
                    </div>
                </div>
            </>
        );
    }

    const total = cart.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
    );

    return (
        <>
            <Header />
            <div className="container">
                <div className="cart-page">
                    <h2 className="cart-title">Корзина</h2>

                    {cart.length === 0 ? (
                        <p className="cart-empty">Ваша корзина пуста</p>
                    ) : (
                        <>
                            <ul className="cart-list">
                                {cart.map((item) => (
                                    <li
                                        key={item.productId._id}
                                        className="cart-item"
                                    >
                                        <img
                                            src={
                                                item.productId.image ||
                                                defaultProduct
                                            }
                                            alt={item.productId.title}
                                            className="cart-item__img"
                                            onError={(e) => {
                                                e.target.src = defaultProduct;
                                            }}
                                        />
                                        <div className="cart-item__info">
                                            <h4>{item.productId.title}</h4>
                                            <p>
                                                {item.quantity} ×{' '}
                                                {item.productId.price} ₽
                                            </p>
                                        </div>
                                        <button
                                            className="cart-item__remove"
                                            onClick={() =>
                                                handleRemove(item.productId._id)
                                            }
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="cart-summary">
                                <h3>Итого: {total} ₽</h3>
                                <button
                                    className="cart-checkout"
                                    onClick={handlePay}
                                    disabled={payLoading}
                                >
                                    {payLoading ? 'Обработка...' : 'Оплатить'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default CartPage;
