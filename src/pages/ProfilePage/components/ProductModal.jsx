import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { createProduct } from '@/api/products.js';
import { validateAvatar } from '@/utils/validators';
import Pica from 'pica';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

function ProductModal({
    productData,
    setProductData,
    setIsProductOpen,
    setProducts,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleProductChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        });
    };

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
            const maxDim = 512; // например, ограничим размер
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
            console.error('Ошибка при сжатии изображения:', err);
            addToast('Не удалось обработать картинку', 'error');
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Валидация
        if (!productData.title.trim()) {
            addToast('Название товара обязательно!', 'error');
            return;
        }

        if (
            !productData.price ||
            isNaN(productData.price) ||
            Number(productData.price) <= 0
        ) {
            addToast('Цена должна быть числом больше 0!', 'error');
            return;
        }

        const invalidChar = productData.characteristics.find(
            (char) => char.name.trim() === '' || char.value.trim() === ''
        );
        if (invalidChar) {
            addToast(
                'Все характеристики должны иметь название и значение!',
                'error'
            );
            return;
        }

        try {
            const characteristicsObject = productData.characteristics.reduce(
                (acc, char) => {
                    acc[char.name.trim()] = char.value.trim();
                    return acc;
                },
                {}
            );

            const newProduct = await createProduct(
                {
                    ...productData,
                    characteristics: characteristicsObject,
                    ownerId: user._id,
                },
                file // сжатая картинка
            );

            setProducts((prev) => [newProduct, ...prev]);
            addToast('Товар добавлен!', 'success');
            setIsProductOpen(false);

            // сброс состояния
            setProductData({
                title: '',
                description: '',
                price: '',
                tags: '',
                characteristics: [],
            });
            setFile(null);
            setPreview(null);
        } catch (err) {
            addToast(`Ошибка при добавлении товара!`, 'error');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal__content">
            <h2>Добавить товар</h2>
            <form onSubmit={handleProductSubmit} className="product-form">
                <input
                    type="text"
                    name="title"
                    value={productData.title}
                    onChange={handleProductChange}
                    placeholder="Название"
                    required
                />
                <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleProductChange}
                    placeholder="Описание"
                />
                <input
                    type="text"
                    name="price"
                    value={productData.price}
                    onChange={handleProductChange}
                    placeholder="Цена"
                />

                {/* Картинка */}
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
                    type="text"
                    name="tags"
                    value={productData.tags}
                    onChange={handleProductChange}
                    placeholder="Теги через запятую"
                />

                {/* Характеристики */}
                <div className="characteristics">
                    <h3>Характеристики</h3>
                    {productData.characteristics.map((char, index) => (
                        <div key={index} className="characteristic-row">
                            <input
                                type="text"
                                value={char.name}
                                placeholder="Название (например: цвет)"
                                onChange={(e) => {
                                    const newCharacteristics = [
                                        ...productData.characteristics,
                                    ];
                                    newCharacteristics[index].name =
                                        e.target.value;
                                    setProductData((prev) => ({
                                        ...prev,
                                        characteristics: newCharacteristics,
                                    }));
                                }}
                            />
                            <input
                                type="text"
                                value={char.value}
                                placeholder="Значение (например: черный)"
                                onChange={(e) => {
                                    const newCharacteristics = [
                                        ...productData.characteristics,
                                    ];
                                    newCharacteristics[index].value =
                                        e.target.value;
                                    setProductData((prev) => ({
                                        ...prev,
                                        characteristics: newCharacteristics,
                                    }));
                                }}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                            setProductData((prev) => ({
                                ...prev,
                                characteristics: [
                                    ...prev.characteristics,
                                    { name: '', value: '' },
                                ],
                            }))
                        }
                    >
                        + Добавить характеристику
                    </button>
                </div>

                <div className="modal__actions">
                    <button
                        type="submit"
                        className="success"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoadingSpinner
                                size={40}
                                color="var(--color-accent-primary)"
                            />
                        ) : (
                            'Добавить'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsProductOpen(false);
                            setProductData({
                                title: '',
                                description: '',
                                price: '',
                                tags: '',
                                characteristics: [],
                            });
                            setFile(null);
                            setPreview(null);
                        }}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductModal;
