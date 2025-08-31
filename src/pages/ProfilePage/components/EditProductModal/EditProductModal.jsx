import { useState } from 'react';
import { updateProduct } from '@/api/products';
import { useToast } from '@/hooks/useToast';
import './EditProductModal.scss';

function EditProductModal({ product, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        tags: product.tags.join(', '),
        characteristics: product.characteristics
            ? Object.entries(product.characteristics).map(([name, value]) => ({
                  name,
                  value,
              }))
            : [],
    });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const characteristicsObject = formData.characteristics
                .filter((c) => c.name.trim() && c.value.trim())
                .reduce((acc, c) => {
                    acc[c.name.trim()] = c.value.trim();
                    return acc;
                }, {});

            const updated = await updateProduct(product._id, {
                ...formData,
                characteristics: characteristicsObject,
            });
            onUpdate(updated);
            addToast('Товар обновлен!', 'success');
            onClose();
        } catch (err) {
            addToast(`Ошибка при обновлении товара: ${err}`, 'error');
        }
    };

    return (
        <div className="edit-product-modal">
            <h2>Редактировать товар</h2>
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
                <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="URL картинки"
                />
                <input
                    name="tags"
                    value={formData.tagsString}
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
        </div>
    );
}

export default EditProductModal;
