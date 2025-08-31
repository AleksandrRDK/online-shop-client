import { useState, useEffect } from 'react';
import { getCart, removeFromCart } from '@/api/carts';
import { useAuth } from '@/hooks/useAuth';

import Header from '@/components/Header/Header';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import defaultProduct from '@/assets/default-product.png';
import './CartPage.scss';

function CartPage() {
    const { user, loading } = useAuth();
    const [cart, setCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            loadCart();
        }
    }, [user]);

    const loadCart = async () => {
        try {
            setCartLoading(true);
            const data = await getCart(user._id);
            setCart(data);
        } catch (err) {
            console.error('Ошибка загрузки корзины:', err);
        } finally {
            setCartLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const updatedCart = await removeFromCart(user._id, productId);
            setCart(updatedCart);
        } catch (err) {
            console.error('Ошибка удаления:', err);
        }
    };

    if (loading || cartLoading) {
        return (
            <>
                <Header />
                <div className="loader-wrapper">
                    <LoadingSpinner size={160} color="#3aaed8" />
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
                                            src={item.productId.image}
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
                                <button className="cart-checkout">
                                    Оплатить
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
