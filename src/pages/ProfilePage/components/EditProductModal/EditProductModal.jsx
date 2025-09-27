import { useState } from 'react';
import { updateProduct } from '@/api/products';
import { useToast } from '@/hooks/useToast';
import { validateAvatar } from '@/utils/validators';
import Pica from 'pica';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import './EditProductModal.scss';

function EditProductModal({ product, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        title: product.title,
        description: product.description,
        price: product.price,
        tags: product.tags.join(', '),
        characteristics: product.characteristics
            ? Object.entries(product.characteristics).map(([name, value]) => ({
                  name,
                  value,
              }))
            : [],
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(product.image || null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCharacteristicChange = (index, field, value) => {
        const newChars = [...formData.characteristics];
        newChars[index][field] = value;
        setFormData((prev) => ({ ...prev, characteristics: newChars }));
    };

    const addCharacteristic = () => {
        setFormData((prev) => ({
            ...prev,
            characteristics: [...prev.characteristics, { name: '', value: '' }],
        }));
    };

    // Загрузка и сжатие картинки через Pica с валидацией
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const error = validateAvatar(selectedFile);
        if (error) {
            addToast(error, 'error');
            return;
        }

        try {
            const pica = Pica();
            const img = document.createElement('img');
            img.src = URL.createObjectURL(selectedFile);
            await img.decode();

            const canvas = document.createElement('canvas');
            const maxDim = 512;
            const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;

            await pica.resize(img, canvas);
            const blob = await pica.toBlob(canvas, selectedFile.type);
            const compressedFile = new File([blob], selectedFile.name, {
                type: selectedFile.type,
            });

            setFile(compressedFile);
            setPreview(URL.createObjectURL(compressedFile));
        } catch (err) {
            console.error('Ошибка обработки файла:', err);
            addToast('Не удалось обработать картинку', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const characteristicsObject = formData.characteristics
                .filter((c) => c.name.trim() && c.value.trim())
                .reduce((acc, c) => {
                    acc[c.name.trim()] = c.value.trim();
                    return acc;
                }, {});

            const updated = await updateProduct(
                product._id,
                {
                    ...formData,
                    tags: formData.tags
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    characteristics: characteristicsObject,
                },
                file
            );

            onUpdate(updated);
            addToast('Товар обновлен!', 'success');
            onClose();
        } catch (err) {
            addToast(`Ошибка при обновлении товара: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-product-modal">
            <h2>Редактировать товар</h2>

            {loading ? (
                <div className="loading-container">
                    <LoadingSpinner size={160} />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="product-form">
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Название"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Описание"
                    />
                    <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Цена"
                    />

                    <div className="product-form__image">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Превью"
                                className="product-preview"
                            />
                        )}
                    </div>

                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Теги через запятую"
                    />

                    <div className="characteristics">
                        <h3>Характеристики</h3>
                        {formData.characteristics.map((c, i) => (
                            <div key={i} className="characteristic-row">
                                <input
                                    value={c.name}
                                    placeholder="Название"
                                    onChange={(e) =>
                                        handleCharacteristicChange(
                                            i,
                                            'name',
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    value={c.value}
                                    placeholder="Значение"
                                    onChange={(e) =>
                                        handleCharacteristicChange(
                                            i,
                                            'value',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addCharacteristic}
                            className="btn-secondary"
                        >
                            + Добавить характеристику
                        </button>
                    </div>

                    <div className="modal__actions">
                        <button type="submit" className="success">
                            Сохранить
                        </button>
                        <button type="button" onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default EditProductModal;
