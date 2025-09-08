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
    const { user } = useAuth();
    const { addToast } = useToast();

    const quantity = cartItems[product._id] || 0;
    const isUpdating = updating[product._id] || false;

    const updateCart = async (productId, change) => {
        if (!user?._id) {
            addToast('Войдите, чтобы добавить товар в корзину', 'warning');
            return;
        }
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
            addToast('Ошибка при обновлении корзины', 'error');
        } finally {
            setUpdating((prev) => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <ProductCardLayout product={product} index={index}>
            <p className="catalog__description">{product.description}</p>
            <p className="catalog__owner">Продавец: {product.owner.username}</p>
            <div className="catalog__actions">
                {quantity === 0 ? (
                    <button
                        className="quantity-btn__global"
                        onClick={() => updateCart(product._id, 1)}
                        disabled={isUpdating}
                    >
                        {isUpdating ? '...' : 'Добавить в корзину'}
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
                            {isUpdating ? (
                                <LoadingSpinner size={40} color="#3aaed8" />
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
