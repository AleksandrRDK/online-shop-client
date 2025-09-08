import { useNavigate } from 'react-router-dom';
import { updateProduct, deleteProduct } from '@/api/products';
import { useToast } from '@/hooks/useToast';
import Pica from 'pica';
import { validateAvatar } from '@/utils/validators';

function ProductActions({
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    setPreview,
    product,
    setProduct,
    setLoading,
}) {
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSave = async () => {
        setLoading(true);
        try {
            let fileToUpload = null;

            if (editData.image instanceof File) {
                // Валидация
                const error = validateAvatar(editData.image);
                if (error) {
                    addToast(error, 'error');
                    return;
                }

                // Сжатие картинки через Pica
                const pica = Pica();
                const img = document.createElement('img');
                img.src = URL.createObjectURL(editData.image);
                await img.decode();

                const canvas = document.createElement('canvas');
                const maxDim = 512;
                const ratio = Math.min(
                    maxDim / img.width,
                    maxDim / img.height,
                    1
                );
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                await pica.resize(img, canvas);
                const blob = await pica.toBlob(canvas, editData.image.type);
                fileToUpload = new File([blob], editData.image.name, {
                    type: editData.image.type,
                });
            }

            // Подготавливаем остальные данные
            const updatedData = {
                ...editData,
                owner: editData.owner,
                tags: editData.tags
                    .split(',')
                    .map((t) => t.trim())
                    .filter((t) => t),
            };

            // Отправляем на сервер
            const updated = await updateProduct(
                product._id,
                updatedData,
                fileToUpload
            );

            // Обновляем состояние
            setProduct(updated);
            setEditData({
                ...editData,
                image: updated.image, // теперь это URL с сервера
            });
            setPreview(updated.image || null);
            addToast('Товар обновлён!', 'success');
            setIsEditing(false);
        } catch (err) {
            addToast('Ошибка при сохранении товара!', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            title: product.title,
            price: product.price,
            description: product.description,
            tags: (product.tags || []).join(', '),
            characteristics: product.characteristics || {},
            image: product.image,
            owner: product.owner?._id || product.owner,
        });
        setPreview(product.image || null);
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
                    <button onClick={handleCancel}>✖ Отмена</button>
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
