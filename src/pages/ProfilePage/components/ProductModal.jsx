import { useToast } from '@/hooks/useToast';
import { createProduct } from '@/api/products.js';

function ProductModal({
    productData,
    setProductData,
    setIsProductOpen,
    user,
    setProducts,
}) {
    const { addToast } = useToast();

    const handleProductChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();

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

        if (
            productData.image &&
            !/^https?:\/\/.+\..+/.test(productData.image)
        ) {
            addToast('Некорректный URL изображения!', 'error');
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

            const newProduct = await createProduct({
                ...productData,
                characteristics: characteristicsObject,
                ownerId: user._id,
            });

            setProducts((prev) => [newProduct, ...prev]);
            addToast('Товар добавлен!', 'success');
            setIsProductOpen(false);
            setProductData({
                title: '',
                description: '',
                price: '',
                image: '',
                tags: '',
                characteristics: [],
            });
        } catch (err) {
            addToast(`Ошибка при добавлении товара!`, 'error');
            console.error(err);
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
                <input
                    type="text"
                    name="image"
                    value={productData.image}
                    onChange={handleProductChange}
                    placeholder="URL картинки"
                />
                <input
                    type="text"
                    name="tags"
                    value={productData.tags}
                    onChange={handleProductChange}
                    placeholder="Теги через запятую"
                />
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
                    <button type="submit" className="success">
                        Добавить
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsProductOpen(false);
                            setProductData({
                                title: '',
                                description: '',
                                price: '',
                                image: '',
                                tags: '',
                                characteristics: [],
                            });
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
