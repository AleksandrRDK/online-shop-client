import { useState } from 'react';
import { removeFromCart, addToCart } from '@/api/carts';
import { useToast } from '@/hooks/useToast';

function QuantityControls({ quantity, user, cartItems, id, setCartItems }) {
    const [updating, setUpdating] = useState(false);
    const { addToast } = useToast();

    const updateCart = async (change) => {
        if (!user?._id) {
            addToast('Войдите, чтобы добавить товар в корзину', 'warning');
            return;
        }
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

    return (
        <>
            {quantity === 0 ? (
                <button
                    className="quantity-btn__global"
                    onClick={() => updateCart(1)}
                    disabled={updating}
                >
                    {updating ? '...' : 'Добавить в корзину'}
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
                            <LoadingSpinner size={30} color="#3aaed8" />
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
        </>
    );
}

export default QuantityControls;
