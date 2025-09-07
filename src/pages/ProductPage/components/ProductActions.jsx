import { useNavigate } from 'react-router-dom';
import { updateProduct, deleteProduct } from '@/api/products';
import { useToast } from '@/hooks/useToast';

function ProductActions({
    isEditing,
    setIsEditing,
    editData,
    product,
    setProduct,
}) {
    const { addToast } = useToast();
    const navigate = useNavigate();

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

    return (
        <div className="product-page__actions">
            {isEditing ? (
                <>
                    <button onClick={handleSave}>💾 Сохранить</button>
                    <button onClick={() => setIsEditing(false)}>
                        ✖ Отмена
                    </button>
                </>
            ) : (
                <>
                    <button onClick={() => setIsEditing(true)}>
                        ✏ Изменить
                    </button>
                    <button onClick={handleDelete}>🗑 Удалить</button>
                </>
            )}
        </div>
    );
}

export default ProductActions;
