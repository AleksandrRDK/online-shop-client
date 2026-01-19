import { addToCart, removeFromCart } from '@/api/carts.js';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import ProductCardLayout from '@/components/ProductCardLayout/ProductCardLayout';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

function ProductCard({
    product,
    index,
    updating,
    cartItems,
    setCartItems,
    setUpdating,
}) {
    const { user, loading: loadingUser } = useAuth();
    const { addToast } = useToast();

    const quantity = cartItems[product._id] || 0;
    const isUpdating = updating[product._id] || false;

    const updateCart = async (productId, change) => {
        if (!user?.id) {
            addToast('Войдите, чтобы добавить товар в корзину', 'warning');
            return;
        }
        try {
            const currentQty = cartItems[productId] || 0;
            const newQuantity = currentQty + change;
            if (newQuantity < 0) return;

            setUpdating((prev) => ({ ...prev, [productId]: true }));

            if (newQuantity === 0) {
                await removeFromCart(productId);
            } else {
                await addToCart(productId, change);
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
            addToast('Ошибка при обновлении корзины', 'error');
        } finally {
            setUpdating((prev) => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <ProductCardLayout product={product} index={index}>
            <p className="catalog__price">
                {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                }).format(product.price)}
            </p>
            <h2 className="catalog__name">{product.title}</h2>
            <p className="catalog__description">{product.description}</p>
            <p className="catalog__owner">Продавец: {product.owner.username}</p>
            <div className="catalog__actions">
                {quantity === 0 ? (
                    <button
                        className="quantity-btn__global"
                        onClick={() => updateCart(product._id, 1)}
                        disabled={isUpdating}
                    >
                        {isUpdating || loadingUser
                            ? '...'
                            : 'Добавить в корзину'}
                    </button>
                ) : (
                    <div className="quantity-controls">
                        <button
                            className="quantity-btn"
                            onClick={() => updateCart(product._id, -1)}
                            disabled={isUpdating}
                        >
                            -
                        </button>
                        <span className="quantity-number">
                            {isUpdating || loadingUser ? (
                                <LoadingSpinner size={40} />
                            ) : (
                                quantity
                            )}
                        </span>
                        <button
                            className="quantity-btn"
                            onClick={() => updateCart(product._id, 1)}
                            disabled={isUpdating}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </ProductCardLayout>
    );
}

export default ProductCard;
