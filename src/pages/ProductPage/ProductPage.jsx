import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct, deleteProduct } from '@/api/products';
import { getCart, removeFromCart, addToCart } from '@/api/carts';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import Header from '@/components/Header/Header';
import defaultProduct from '@/assets/default-product.png';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import './ProductPage.scss';
import '@/styles/quantity.scss';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cartItems, setCartItems] = useState({});
    const [updating, setUpdating] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: '',
        price: '',
        description: '',
        tags: '',
        characteristics: {},
        image: '',
        owner: null,
    });

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                getProductById(id).then((data) => {
                    setProduct(data);
                    setEditData({
                        title: data.title,
                        price: data.price,
                        description: data.description,
                        tags: (data.tags || []).join(', '),
                        characteristics: data.characteristics || {},
                        image: data.image,
                        owner: data.owner?._id || data.owner,
                    });
                });

                if (user?._id) {
                    const cart = await getCart(user._id);
                    const initialCart = {};
                    cart.forEach((item) => {
                        initialCart[item.productId._id] = item.quantity;
                    });
                    setCartItems(initialCart);
                }
            } catch (error) {
                setError('Ошибка при загрузке товара', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const updateCart = async (change) => {
        if (!user) return;
        const currentQty = cartItems[id] || 0;
        const newQuantity = currentQty + change;
        if (newQuantity < 0) return;

        try {
            setUpdating(true);
            if (newQuantity === 0) {
                await removeFromCart(user._id, id);
            } else {
                await addToCart(user._id, id, change);
            }
            setCartItems((prev) => {
                const updated = { ...prev };
                if (newQuantity === 0) delete updated[id];
                else updated[id] = newQuantity;
                return updated;
            });
        } catch (err) {
            console.error(err);
            addToast('Ошибка при обновлении корзины', 'error');
        } finally {
            setUpdating(false);
        }
    };

    if (loading)
        return (
            <div className="loader-wrapper">
                <LoadingSpinner size={160} color="#3aaed8" />
            </div>
        );
    if (error) return <p className="status error">{error}</p>;
    if (!product) return <p className="status">Товар не найден</p>;

    const formattedDate = product.createdAt
        ? new Date(product.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    const handleChange = (field, value) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCharacteristicChange = (key, value) => {
        setEditData((prev) => ({
            ...prev,
            characteristics: {
                ...prev.characteristics,
                [key]: value,
            },
        }));
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                ...editData,
                owner: editData.owner,
                tags: editData.tags
                    .split(',')
                    .map((t) => t.trim())
                    .filter((t) => t),
            };
            const updated = await updateProduct(product._id, updatedData);
            setProduct(updated);
            addToast('Товар обновлён!', 'success');
            setIsEditing(false);
        } catch (err) {
            addToast('Ошибка при сохранении товара!', 'error');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (confirm('Удалить товар?')) {
            try {
                await deleteProduct(product._id);
                addToast('Товар удалён!', 'success');
                navigate(-1);
            } catch (err) {
                addToast('Ошибка при удалении товара!', 'error');
                console.error(err);
            }
        }
    };

    const quantity = cartItems[id] || 0;
    const isOwner =
        user &&
        product.owner &&
        (product.owner._id === user._id || product.owner === user._id);

    return (
        <>
            <Header />
            <div className="container">
                <div className="product-page">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Назад
                    </button>

                    <div className="product-page__header">
                        <img
                            src={product.image}
                            alt={product.title}
                            onError={(e) => {
                                e.target.src = defaultProduct;
                            }}
                        />
                        <div className="product-page__info">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={(e) =>
                                            handleChange(
                                                'title',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <input
                                        type="number"
                                        value={editData.price}
                                        onChange={(e) =>
                                            handleChange(
                                                'price',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <textarea
                                        value={editData.description}
                                        onChange={(e) =>
                                            handleChange(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        value={editData.image}
                                        onChange={(e) =>
                                            handleChange(
                                                'image',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        value={editData.tags}
                                        onChange={(e) =>
                                            handleChange('tags', e.target.value)
                                        }
                                    />
                                </>
                            ) : (
                                <>
                                    <h1>{product.title}</h1>
                                    <p className="price">{product.price} ₽</p>
                                    {quantity === 0 ? (
                                        <button
                                            className="quantity-btn__global"
                                            onClick={() => updateCart(1)}
                                            disabled={updating}
                                        >
                                            {updating
                                                ? '...'
                                                : 'Добавить в корзину'}
                                        </button>
                                    ) : (
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateCart(-1)}
                                                disabled={updating}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-number">
                                                {updating ? (
                                                    <LoadingSpinner
                                                        size={30}
                                                        color="#3aaed8"
                                                    />
                                                ) : (
                                                    quantity
                                                )}
                                            </span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateCart(1)}
                                                disabled={updating}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                    {product.tags &&
                                        product.tags.length > 0 && (
                                            <p className="tags">
                                                Теги: {product.tags.join(', ')}
                                            </p>
                                        )}
                                    <p className="desc">
                                        {product.description}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {Object.keys(product.characteristics || {}).length > 0 && (
                        <div className="product-page__characteristics">
                            <h2>Характеристики</h2>
                            <table>
                                <tbody>
                                    {Object.entries(
                                        isEditing
                                            ? editData.characteristics
                                            : product.characteristics
                                    ).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) =>
                                                            handleCharacteristicChange(
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    value
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {product.owner && (
                        <div className="product-page__owner">
                            <h2>Продавец</h2>
                            <p>
                                {product.owner.username} ({product.owner.email})
                            </p>
                        </div>
                    )}

                    {formattedDate && (
                        <div className="product-page__date">
                            <p>Добавлено: {formattedDate}</p>
                        </div>
                    )}

                    {isOwner && (
                        <div className="product-page__actions">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave}>
                                        💾 Сохранить
                                    </button>
                                    <button onClick={() => setIsEditing(false)}>
                                        ✖ Отмена
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)}>
                                        ✏ Изменить
                                    </button>
                                    <button onClick={handleDelete}>
                                        🗑 Удалить
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductPage;
