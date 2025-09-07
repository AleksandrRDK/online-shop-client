import { useParams } from 'react-router-dom';

import QuantityControls from './QuantityControls';

import defaultProduct from '@/assets/default-product.png';

function ProductHeader({ product, editing, cart, user }) {
    const { id } = useParams();
    const { isEditing, editData, setEditData } = editing;
    const { quantity, cartItems, setCartItems } = cart;

    const handleChange = (field, value) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
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
                                handleChange('title', e.target.value)
                            }
                        />
                        <input
                            type="number"
                            value={editData.price}
                            onChange={(e) =>
                                handleChange('price', e.target.value)
                            }
                        />
                        <textarea
                            value={editData.description}
                            onChange={(e) =>
                                handleChange('description', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            value={editData.image}
                            onChange={(e) =>
                                handleChange('image', e.target.value)
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
                        <QuantityControls
                            quantity={quantity}
                            user={user}
                            cartItems={cartItems}
                            id={id}
                            setCartItems={setCartItems}
                        />
                        {product.tags && product.tags.length > 0 && (
                            <p className="tags">
                                Теги: {product.tags.join(', ')}
                            </p>
                        )}
                        <p className="desc">{product.description}</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductHeader;
