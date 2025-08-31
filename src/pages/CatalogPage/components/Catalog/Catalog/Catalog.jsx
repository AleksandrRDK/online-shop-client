import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '@/api/products.js';
import { addToCart, getCart, removeFromCart } from '@/api/carts.js';
import { useAuth } from '@/hooks/useAuth';

import './Catalog.scss';
import '@/styles/quantity.scss';
import { motion as Motion } from 'framer-motion';
import defaultProduct from '@/assets/default-product.png';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState({}); // { productId: quantity }
    const [updating, setUpdating] = useState({}); // { productId: true/false }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts();
                setProducts(data);

                if (user?._id) {
                    const cart = await getCart(user._id);
                    const initialCart = {};
                    cart.forEach((item) => {
                        initialCart[item.productId._id] = item.quantity;
                    });
                    setCartItems(initialCart);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const updateCart = async (productId, change) => {
        try {
            const currentQty = cartItems[productId] || 0;
            const newQuantity = currentQty + change;

            if (newQuantity < 0) return;

            setUpdating((prev) => ({ ...prev, [productId]: true }));

            if (newQuantity === 0) {
                await removeFromCart(user._id, productId);
            } else {
                await addToCart(user._id, productId, change);
            }

            setCartItems((prev) => {
                const updated = { ...prev };
                if (newQuantity === 0) {
                    delete updated[productId];
                } else {
                    updated[productId] = newQuantity;
                }
                return updated;
            });
        } catch (err) {
            console.error(err);
            alert('Ошибка при обновлении корзины');
        } finally {
            setUpdating((prev) => ({ ...prev, [productId]: false }));
        }
    };

    if (loading) {
        return (
            <div className="loader-wrapper">
                <LoadingSpinner size={160} color="#3aaed8" />
            </div>
        );
    }

    return (
        <div className="container">
            <div className="catalog">
                <h1 className="catalog__title">Каталог товаров</h1>
                <div className="catalog__grid">
                    {products.map((p, i) => {
                        const quantity = cartItems[p._id] || 0;
                        const isUpdating = updating[p._id] || false;

                        return (
                            <Motion.div
                                key={p._id}
                                className="product-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                            >
                                <img
                                    className="catalog__image"
                                    src={p.image}
                                    alt={p.title}
                                    onError={(e) => {
                                        e.target.src = defaultProduct;
                                    }}
                                />
                                <h2 className="catalog__name">{p.title}</h2>
                                <p className="catalog__description">
                                    {p.description}
                                </p>
                                <div className="catalog__tags">
                                    {p.tags.slice(0, 3).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="catalog__tag"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="catalog__owner">
                                    Продавец: {p.owner.username}
                                </p>
                                <div className="catalog__actions">
                                    {quantity === 0 ? (
                                        <button
                                            className="quantity-btn__global"
                                            onClick={() => updateCart(p._id, 1)}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating
                                                ? '...'
                                                : 'Добавить в корзину'}
                                        </button>
                                    ) : (
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-btn"
                                                onClick={() =>
                                                    updateCart(p._id, -1)
                                                }
                                                disabled={isUpdating}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-number">
                                                {isUpdating ? (
                                                    <LoadingSpinner
                                                        size={40}
                                                        color="#3aaed8"
                                                    />
                                                ) : (
                                                    quantity
                                                )}
                                            </span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() =>
                                                    updateCart(p._id, 1)
                                                }
                                                disabled={isUpdating}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                    <Link
                                        to={`/product/${p._id}`}
                                        className="product-info-circle"
                                    >
                                        !
                                    </Link>
                                </div>
                            </Motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
